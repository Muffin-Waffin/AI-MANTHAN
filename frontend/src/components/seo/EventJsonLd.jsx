const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-manthan.example.com'

/**
 * JSON-LD structured data — helps Google show rich results (event dates,
 * location, organizer) for the hackathon.
 */
export default function EventJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'AI MANTHAN 2.0 — National-Level AI Hackathon',
    description:
      'A 24-hour offline hackathon at AITR, Indore across 12 AI challenge domains, with a ₹1,00,000+ prize pool.',
    startDate: '2026-10-14T09:00+05:30',
    endDate: '2026-10-16T21:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'AITR Arena, Bypass Road, Mangliya Sadak, Indore',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bypass Road, Mangliya Sadak',
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
      name: 'Acropolis Institute of Technology and Research, Indore',
      url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.acropolis.in/',
    },
    offers: {
      '@type': 'Offer',
      name: 'Free Registration',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: process.env.NEXT_PUBLIC_REGISTER_URL || 'https://unstop.com/p/ai-manthan-2k26-acropolis-institute-of-technology-and-research-indore-1751106',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
