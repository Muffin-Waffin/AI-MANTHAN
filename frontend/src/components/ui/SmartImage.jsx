import Image from 'next/image'

/**
 * next/image wrapper — remote images (lh3.googleusercontent.com etc.)
 * bypass the /_next/image optimizer entirely. Why: on slow networks the
 * optimizer's upstream fetch times out (`upstream image response timed
 * out`, 504) and the image NEVER loads — the browser fetching the
 * original URL directly is far more resilient (own cache + retries).
 * Local images still get full optimization.
 *
 * Drop-in replacement: same props as next/image.
 */
export default function SmartImage({ src, unoptimized, ...props }) {
  const remote = typeof src === 'string' && /^https?:\/\//i.test(src)
  return <Image src={src} unoptimized={unoptimized || remote} {...props} />
}
