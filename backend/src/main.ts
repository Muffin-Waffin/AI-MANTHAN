import 'reflect-metadata'
import cors from 'cors'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { connectDatabase } from './config/database'

const PORT = Number(process.env.PORT || 4000)
const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',')

async function bootstrap() {
  await connectDatabase()

  const app = await NestFactory.create(AppModule, {
    // Cap request bodies — oversized payloads are rejected before routing
    bodyParser: require('express').json({ limit: '16kb' }),
  })
  app.setGlobalPrefix('api')
  app.use(cors({ origin: CORS_ORIGINS }))
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  )

  await app.listen(PORT)
  console.log(`[api] AI Manthan 2026 backend listening on http://localhost:${PORT}/api`)
}

void bootstrap()