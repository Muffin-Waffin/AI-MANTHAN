# AI Manthan 2.0 — Production-Ready Responsive Progressive Web App (PWA)

Monorepo for the **AI Manthan 2.0** national AI hackathon site, hosted at
**Acropolis Institute of Technology & Research (AITR)**, Bypass Road, Square, Manglaya Sadak, Indore.

## 🌟 Key Highlights

- **Installable Progressive Web App (PWA):** Standalone mode, Web App Manifest, offline caching with Service Worker, and non-intrusive install prompts for Android, iOS Safari, and Desktop.
- **Offline-First Resilience:** App shell caching, dedicated `/offline` page, and IndexedDB action queue for support inquiries with auto-sync on reconnect.
- **Mobile-First Responsive Layout:** Fluid layouts, safe-area insets (`env(safe-area-inset-bottom)`), mobile bottom navigation bar, touch-friendly targets (>= 44px), and adaptive card systems.
- **Next.js 16 App Router & React 19:** Turbopack builds, self-hosted optimized fonts, error boundaries, loading skeletons, and SSG profile dossiers.
- **Database & Media:** Neon Serverless PostgreSQL (`@neondatabase/serverless`) + Cloudinary Media CDN.

```text
Routes:
  /                     Single-page arena — all sections anchored (#overview, #tracks, #timeline, #prizes, …)
  /faculty/[slug]       Unified profile dossier (SSG — jury, mentors, speakers, faculty leadership)
  /problem-statements   12 confirmed challenge domains & problem statement repository
  /support              Support & inquiry dispatch (with IndexedDB offline queuing)
  /team                 Team & community organizing crew roster
  /admin                Command Desk — support queue & analytics (disallowed from crawler index)
  /offline              Branded offline protocol fallback page
```

---

## ⚡ Quick Start

```bash
cd frontend
cp .env.example .env.local   # set DATABASE_URL + CLOUDINARY credentials
npm install
npm run dev                  # Site running on http://localhost:3000
```

---

## 🏗️ Build & Production Deployment

```bash
cd frontend
npm run build                # Compiles Next.js application & runs type/lint checks
npm run start                # Serves optimized production build on http://localhost:3000
```

---

## 📖 Detailed Documentation

See [`frontend/README.md`](frontend/README.md) for full architecture notes, PWA configuration, and service worker details.
