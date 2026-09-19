import 'reflect-metadata'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { connectDatabase } from './config/database'

/**
 * Production-ready bootstrap.
 *
 * Hosting (Render): the platform injects PORT and expects the server to
 * accept connections from outside the container, so the app binds 0.0.0.0.
 * Local dev stays identical: no PORT set → 4000 on the loopback default.
 *
 * CORS: the frontend origin(s) come from CORS_ORIGINS (comma-separated).
 * - Local dev default: http://localhost:3000
 * - Production: the Vercel domain, plus Vercel preview URLs via
 *   `*.vercel.app` wildcard entries (matched by regex — the cors package
 *   does NOT expand `*` inside strings on its own).
 * - No origin header (curl, server-to-server, Render health checks) is
 *   always allowed through — CORS only guards browsers.
 */
function buildCorsOriginChecker(logger?: Logger) {
  // Default covers local dev AND Vercel deploys (prod + previews) so the
  // API works out of the box; set CORS_ORIGINS in production to pin the
  // exact domain(s) and drop the broad wildcard.
  const raw =
    process.env.CORS_ORIGINS ?? 'http://localhost:3000,https://*.vercel.app'
  if (!process.env.CORS_ORIGINS && logger && process.env.NODE_ENV === 'production') {
    logger.warn('CORS_ORIGINS not set — falling back to localhost + *.vercel.app')
  }
  const entries = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  // `CORS_ORIGINS=*` → allow any origin (public APIs only; not default)
  if (entries.includes('*')) return () => true

  // Exact origins + wildcard patterns (`https://*.vercel.app`)
  const exact = new Set(entries.filter((e) => !e.includes('*')))
  const wildcards = entries
    .filter((e) => e.includes('*'))
    .map((pattern) => {
      // Escape regex specials, then turn `*` into a single-label wildcard
      const esc = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`^${esc.replace(/\\\*/g, '[^.]+')}$`)
    })

  /* IMPORTANT: the origin check MUST use the error-first CALLBACK form.
     Returning a plain boolean hangs every request (the middleware awaits
     a response that never resolves). */
  return (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return cb(null, true) // curl / health checks / server-to-server
    if (exact.has(origin)) return cb(null, true)
    return cb(null, wildcards.some((re) => re.test(origin)))
  }
}

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production'
  const logger = new Logger('Bootstrap')

  await connectDatabase()

  const app = await NestFactory.create(AppModule, {
    // Cap request bodies — oversized payloads are rejected before routing
    bodyParser: require('express').json({ limit: '16kb' }),
    // Render terminates TLS at its edge; Express must trust X-Forwarded-*
    logger: isProd ? ['error', 'warn', 'log'] : ['debug', 'error', 'warn', 'log'],
  })
  app.setGlobalPrefix('api')
  // enableCors wires the cors middleware at the adapter level so OPTIONS
  // preflights are answered by CORS itself — a manual `app.use(cors())`
  // mounts AFTER Nest's router and preflights fall through to a 404.
  app.enableCors({
    origin: buildCorsOriginChecker(logger),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    maxAge: 86400,
  })
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  )

  // Render health checks / proxies sit in front of the app
  app.getHttpAdapter().getInstance().set('trust proxy', 1)

  // Render injects PORT; local default stays 4000
  const port = Number(process.env.PORT || 4000)
  await app.listen(port, '0.0.0.0')
  logger.log(`API listening on 0.0.0.0:${port} (mode: ${isProd ? 'production' : 'development'})`)

  // Graceful shutdown — Render sends SIGTERM on deploys/restarts
  const shutdown = async (signal: string) => {
    logger.warn(`${signal} received — closing server…`)
    await app.close()
    process.exit(0)
  }
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))
}

void bootstrap()
