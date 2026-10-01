# AI Manthan 2026 — Hackathon Platform (Next.js + Neon PostgreSQL + Cloudinary)

Monorepo for the AI Manthan 2026 national AI hackathon site, hosted at
Acropolis Institute of Technology & Research, Bypass Road, Square, Manglaya Sadak, Indore.

**Stack:**
- **Database:** Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- **Media CDN:** Cloudinary Image CDN (`uvnobshe`)
- **Frontend:** Next.js 16 (React 19) + Tailwind CSS v4

```
frontend/   Next.js 16 (React 19) + Tailwind CSS v4  → http://localhost:3000
build/      Original design reference (DESIGN.md, screen.png)

Routes:
  /                 Single-page site — all sections anchored (#overview, #tracks, #faculty, #prizes, …)
  /faculty/[slug]   Unified profile dossier (SSG, 13 pages — jury, mentors, speakers, faculty leadership)
  /support          Dedicated support/contact page
  /team             Team roster page
  /admin            Command Desk — support queue & analytics
```

## Quick start

```bash
cd frontend
cp .env.example .env.local   # set DATABASE_URL + CLOUDINARY credentials
npm install
npm run dev                  # Site on http://localhost:3000
```

## Environment Configuration

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:...@ep-rapid-butterfly-b451ro1g-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require

# Media (Cloudinary CDN)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=uvnobshe
CLOUDINARY_API_KEY=167325162428266
CLOUDINARY_API_SECRET=aQb42xbC0egutUN6iT78_Gs6psU
CLOUDINARY_URL=cloudinary://167325162428266:aQb42xbC0egutUN6iT78_Gs6psU@uvnobshe

# SMTP Mail Server
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM="AI Manthan 2.0 <no-reply@aimanthan.in>"
```
