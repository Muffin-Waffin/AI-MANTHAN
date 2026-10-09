# AI MANTHAN 2.0 — Production Progressive Web App (PWA)

A high-performance, mobile-first, installable Progressive Web Application (PWA) for the national AI hackathon **AI MANTHAN 2.0** hosted at **Acropolis Institute of Technology & Research (AITR)**, Indore. Built using modern React 19, Next.js 16 (App Router), Tailwind CSS v4, Neon Serverless PostgreSQL, and IndexedDB offline synchronization.

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS v4 + Titanium Cyber Lumina design tokens
- **PWA System:**
  - Standard Web App Manifest (`manifest.webmanifest` & `manifest.json`)
  - Standalone display mode with `portrait-primary` orientation
  - Multi-resolution icons (72px to 512px) with safe-zone maskable assets
  - Production Service Worker (`/sw.js`) with cache versioning and cleanups
  - Network-first navigation caching with dedicated `/offline` fallback
  - IndexedDB offline queue (`aim_pwa_db`) with automatic reconnection sync
  - In-app install experience (`InstallAppPrompt`) with iOS Safari guidance
- **Database & Backend:** Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- **Media CDN:** Cloudinary CDN + Next.js optimized remote patterns
- **Typography:** Self-hosted `next/font` (Plus Jakarta Sans, Space Mono, Caveat, Cormorant Garamond)

---

## 📱 Responsive & Mobile-First Design

The application is engineered to adapt fluidly across all device form factors:
- **Small Mobile (320px – 430px):** Single-column and tight fluid grids, mobile bottom app navigation bar with safe-area insets (`env(safe-area-inset-bottom)`), touch targets >= 44x44px, and tap-to-reveal interactions replacing mouse hover.
- **Tablet (600px – 1024px):** Adaptive 2- and 3-column card systems, responsive dashboards, and balanced spacing.
- **Desktop (1280px – 1920px+):** Fluid max-width containers, smooth ambient reflections, sliding capsule header, and multi-tier grids.

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm (or pnpm / yarn)

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Environment Variables
Copy the template and configure your credentials:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain URL (e.g. `https://aimanthan.in`) |
| `DATABASE_URL` | Neon Serverless PostgreSQL connection string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP server configuration for email dispatch |

### 4. Running the Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Production Build & Deployment

To verify TypeScript, route generation, and build static assets:
```bash
npm run build
```

To run the production server locally:
```bash
npm run start
```

### Deploying to Production
This repository is optimized for zero-config deployment on:
- **Vercel:** Automatic detection of Next.js App Router and edge headers.
- **Render / AWS / DigitalOcean / Cloudflare Pages:** Standard Node.js runtime supporting `npm run build` and `npm run start`.

---

## 🚀 Progressive Web App (PWA) Capabilities

### 1. Installation
- **Chromium / Android:** Prompts automatically through `beforeinstallprompt` via the `InstallAppPrompt` banner and menu action buttons.
- **iOS Safari:** Interactive 3-step modal explaining "Share -> Add to Home Screen".
- **Standalone Detection:** Bypasses promotional prompts when opened from home screen icon.

### 2. Offline Behavior
- **App Shell Precaching:** Critical pages (`/`, `/problem-statements`, `/team`, `/support`) and static icons are stored in CacheStorage.
- **Offline Fallback:** Navigating to an un-cached URL while disconnected serves the branded `/offline` protocol page.
- **IndexedDB Action Queue:** Support inquiries and feedback submitted while offline are persisted in `inquiry_queue` and dispatched automatically when network connectivity is re-established.
- **Live Status Indicator:** Real-time online/offline indicator pills notify users of connectivity changes.

---

## 📂 Project Directory Structure

```text
frontend/
├── public/
│   ├── icons/            # PWA icons (72x72 to 512x512, maskable, apple-touch)
│   ├── logos/            # Official vector & raster logos
│   ├── manifest.json     # Static Web App Manifest
│   ├── sw.js             # Production Service Worker
│   └── ...
├── src/
│   ├── app/
│   │   ├── layout.jsx    # Root layout with PWA metadata & fonts
│   │   ├── manifest.js   # Dynamic Next.js Web App Manifest
│   │   ├── page.jsx      # Single-page hackathon arena
│   │   ├── loading.jsx   # Suspense loading state with cyber spinner
│   │   ├── error.jsx     # Global error boundary
│   │   ├── not-found.jsx # 404 signal lost page
│   │   ├── offline/      # Dedicated offline fallback page
│   │   ├── admin/        # Command Desk support & analytics
│   │   ├── faculty/      # Jury, Mentors & Faculty profile SSG pages
│   │   ├── problem-statements/ # 12 domain problem statement repository
│   │   ├── support/      # Support ticket dispatch with offline sync
│   │   ├── team/         # Organizing crew & leadership roster
│   │   ├── robots.js     # Robots policy (disallows /admin)
│   │   └── sitemap.js    # Automated XML sitemap
│   ├── components/
│   │   ├── layout/       # AppShell, Navbar, Footer, Modals
│   │   ├── pwa/          # PwaManager, InstallAppPrompt, MobileBottomNav
│   │   ├── sections/     # Hero, Tracks, Timeline, Prizes, Gallery, etc.
│   │   └── ui/           # Atomic buttons, dialogs, badges, countdown
│   ├── data/             # Static domain datasets, site config, prizes
│   ├── lib/              # Neon DB client, offlineQueue (IndexedDB), utilities
│   └── styles/           # Tailwind CSS v4, safe-area utilities, animations
├── .env.example
├── next.config.mjs
└── package.json
```