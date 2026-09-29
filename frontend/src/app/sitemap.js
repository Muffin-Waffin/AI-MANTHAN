const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-manthan.example.com'
import { facultyDirectory } from '@/data/facultyDirectory'

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/team`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/problem-statements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...facultyDirectory.map((f) => ({
      url: `${SITE_URL}/faculty/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ]
}
