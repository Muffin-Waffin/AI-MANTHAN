/**
 * Cloudinary CDN Helper Utilities
 * Automatically routes and optimizes image assets using Cloudinary CDN.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'uvnobshe'

/**
 * Returns an optimized Cloudinary URL for a given public ID or image path.
 * If already a full URL, returns it or wraps with Cloudinary fetch/upload format.
 */
export function getCloudinaryUrl(src, options = {}) {
  if (!src) return ''

  // If already a Cloudinary URL, return as is
  if (typeof src === 'string' && src.includes('res.cloudinary.com')) {
    return src
  }

  // If local static path (e.g. /pastaimathan/... or /logos/...), return local path directly
  if (typeof src === 'string' && src.startsWith('/')) {
    return src
  }

  // Remote image URL -> Cloudinary Fetch API
  if (typeof src === 'string' && /^https?:\/\//i.test(src)) {
    const encodedUrl = encodeURIComponent(src)
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto/${encodedUrl}`
  }

  return src
}

/**
 * Cloudinary image uploader helper (Client or Server side)
 */
export async function uploadToCloudinary(file, folder = 'ai_manthan') {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ai_manthan_uploads'
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error?.message || 'Failed to upload image to Cloudinary')
  }

  return await res.json()
}
