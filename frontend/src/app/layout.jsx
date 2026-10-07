import { Plus_Jakarta_Sans, Space_Mono, Caveat, Cormorant_Garamond } from 'next/font/google'
import '@/styles/index.css'
import '@/styles/vertical-timeline.css'
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
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-manthan.example.com'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AI MANTHAN 2.0 — 24-Hour National AI Hackathon at AITR Indore',
    template: '%s | AI MANTHAN 2.0',
  },
  description:
    "AI MANTHAN 2.0 — the national-level AI hackathon at Acropolis Institute of Technology and Research, Indore. A 24-hour offline hackathon across 12 AI challenge domains and a ₹1,00,000+ prize pool. October 14–16, 2026.",
  keywords: [
    'AI Manthan 2.0',
    'AI Manthan hackathon',
    'AITR Indore hackathon',
    'AI Manthan 2K26',
    'national AI hackathon India',
    '24 hour hackathon',
    '24-hour offline hackathon',
    'student hackathon',
    'AI hackathon',
    'hackathon India 2026',
    'AI hackathon Indore',
    'college hackathon Madhya Pradesh',
    'IIT NIT BITS hackathon',
  ],
  authors: [{ name: 'Acropolis — AI MANTHAN 2.0' }],
  creator: 'Acropolis Institute of Technology and Research',
  publisher: 'Acropolis Institute of Technology and Research, Indore',

  // Canonical + URL
  alternates: { canonical: '/' },

  // Open Graph (WhatsApp, LinkedIn, Facebook previews)
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'AI MANTHAN 2.0 — AITR Indore',
    title: 'AI MANTHAN 2.0 — National AI Hackathon at AITR Indore | Oct 14–16, 2026',
    description:
      '12 AI challenge domains, 24-hour offline finale, ₹1,00,000+ prize pool. AITR flagship AI hackathon, October 14–16, 2026.',
  },

  // Twitter/X card — image is auto-wired by app/opengraph-image.jsx
  twitter: {
    card: 'summary_large_image',
    title: 'AI MANTHAN 2.0 — National AI Hackathon at AITR Indore | Oct 14–16, 2026',
    description:
      '12 AI challenge domains, 24-hour offline finale, ₹1,00,000+ prize pool. October 14–16, 2026.',
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
  themeColor: '#06080d',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`dark scroll-smooth ${jakarta.variable} ${spaceMono.variable} ${caveat.variable} ${cormorant.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
