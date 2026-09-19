import { Plus_Jakarta_Sans, Space_Mono, Caveat } from 'next/font/google'
import '@/styles/index.css'
import AppShell from '@/components/layout/AppShell'
import Analytics from '@/components/seo/Analytics'

// Self-hosted fonts via next/font — no render-blocking Google Fonts requests,
// no layout shift, automatic preload of the exact weights used.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-spacemono',
  display: 'swap',
})
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-manthan.example.com'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AI Manthan 2026 — 36 Hours of Relentless Engineering at Acropolis Indore',
    template: '%s | AI Manthan 2026',
  },
  description:
    "The flagship national AI hackathon at Acropolis Institute of Technology & Research, Indore — 36 hours of relentless engineering, ₹2,00,000+ bounty pool, and 1,500+ frontier builders. October 14–16, 2026.",
  keywords: [
    'AI Manthan hackathon',
    'Acropolis Indore hackathon',
    'AI Manthan 2026',
    'national AI hackathon India',
    '36 hour hackathon',
    'student hackathon',
    'AI hackathon',
    'blockchain hackathon',
    'hackathon India 2026',
    'AI hackathon Indore',
    'college hackathon Madhya Pradesh',
    'IIT NIT BITS hackathon',
  ],
  authors: [{ name: 'Acropolis — AI Manthan' }],
  creator: 'Acropolis Institute of Technology & Research',
  publisher: 'Acropolis Institute of Technology & Research, Indore',

  // Canonical + URL
  alternates: { canonical: '/' },

  // Open Graph (WhatsApp, LinkedIn, Facebook previews)
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'AI Manthan 2026 — Acropolis Indore',
    title: 'AI Manthan 2026 — AI Hackathon at Acropolis Indore | Oct 14–16, 2026',
    description:
      '1,500+ builders, 6 challenge tracks, ₹2,00,000+ bounty pool. Acropolis flagship AI hackathon, October 14–16, 2026.',
  },

  // Twitter/X card — image is auto-wired by app/opengraph-image.jsx
  twitter: {
    card: 'summary_large_image',
    title: 'AI Manthan 2026 — AI Hackathon at Acropolis Indore | Oct 14–16, 2026',
    description:
      '1,500+ builders, 6 challenge tracks, ₹2,00,000+ bounty pool. October 14–16, 2026.',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'technology',

  icons: { icon: '/favicon.png', type: 'image/png' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06070a',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`dark scroll-smooth ${jakarta.variable} ${spaceMono.variable} ${caveat.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
