'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'

/**
 * Smart back link — history-aware wapas navigation with EXACT scroll
 * restore. Detection hamare apne flag par: jab bhi site ke andar kisi
 * cross-page link se navigate hota hai, SmoothScroll 'aim-internal-nav'
 * set karta hai. Ye flag present hai toh back click history.back() karta
 * hai (SmoothScroll saved offset pe restore karta hai) — warna normal
 * `href` fallback.
 */
export default function SmartBack({ href, label, className = '' }) {
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    let internal = false
    try {
      internal = sessionStorage.getItem('aim-internal-nav') === '1'
    } catch { /* ignore */ }
    // history me pichla entry bhi hona chahiye (direct load par nahi hota)
    setCanGoBack(internal && window.history.length > 1)
  }, [])

  return (
    <Link
      href={href}
      data-smart-back
      onClick={(e) => {
        if (canGoBack) {
          e.preventDefault()
          try {
            sessionStorage.setItem('aim-restore-now', '1')
          } catch { /* ignore */ }
          window.history.back()
        }
      }}
      className={className}
    >
      <Icon name="arrow_back" className="text-[18px]" />
      {label}
    </Link>
  )
}
