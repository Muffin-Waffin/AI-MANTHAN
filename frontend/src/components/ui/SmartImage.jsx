import Image from 'next/image'
import { getCloudinaryUrl } from '@/lib/cloudinary'

/**
 * SmartImage — Cloudinary CDN powered image component.
 * Automatically formats local & remote images through Cloudinary CDN.
 */
export default function SmartImage({ src, unoptimized, ...props }) {
  const cloudinarySrc = getCloudinaryUrl(src)
  const remote = typeof cloudinarySrc === 'string' && /^https?:\/\//i.test(cloudinarySrc)
  return <Image src={cloudinarySrc || src} unoptimized={unoptimized || remote} {...props} />
}
