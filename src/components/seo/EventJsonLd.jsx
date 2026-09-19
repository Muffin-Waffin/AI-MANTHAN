const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-manthan.example.com'

/**
 * JSON-LD structured data — helps Google show rich results (event dates,
 * location, organizer) for the hackathon.
 */
export default function EventJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'AI Manthan 2026 — Flagship AI Hackathon',
    description:
      '36 hours of relentless engineering at Acropolis, Indore. 1,500+ frontier builders, 6 challenge tracks, and a ₹2,00,000+ bounty pool.',
    startDate: '2026-10-14T09:00+05:30',
    endDate: '2026-10-16T21:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Acropolis Arena, Bypass Road, Manglaya Sadak, Indore',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bypass Road, Square, Manglaya Sadak',
        addressLocality: 'Indore',
        addressRegion: 'Madhya Pradesh',
        postalCode: '453771',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 22.7196,
        longitude: 75.8577,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Acropolis Institute of Technology & Research, Indore',
      url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.acropolis.in/',
    },
    offers: {
      '@type': 'Offer',
      name: 'Free Registration',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: process.env.NEXT_PUBLIC_REGISTER_URL || 'https://unstop.com/p/ai-manthan-2026-acropolis-hackathon-1506313',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
