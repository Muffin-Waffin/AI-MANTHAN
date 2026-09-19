'use client'

import Script from 'next/script'
import { useEffect } from 'react'

/**
 * Analytics loader — GA4 only when NEXT_PUBLIC_GA_ID is set.
 * Without the env var nothing loads (no dead script tags in prod).
 *
 * Conversion tracking is delegated at the document level, so no
 * component needs manual wiring:
 *   - any link to the registration page  → register_click
 *   - any link to the WhatsApp community → whatsapp_click
 *   - support form submissions           → support_submit / support_error
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href]')
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (href.includes('unstop.com')) {
        window.trackEvent?.('register_click', { location: a.closest('section,header')?.id || 'global' })
      } else if (
        href.includes('chat.whatsapp.com') ||
        href.includes('wa.me') ||
        href.includes('whatsapp.com/channel')
      ) {
        window.trackEvent?.('whatsapp_click', {})
      }
    }
    const onSupportSubmit = () => window.trackEvent?.('support_submit', {})
    document.addEventListener('click', onClick)
    window.addEventListener('open-support-modal', () => window.trackEvent?.('support_open', {}))
    window.addEventListener('support-submitted', onSupportSubmit)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
          window.trackEvent = function (name, params) {
            if (window.gtag) window.gtag('event', name, params || {});
          };
        `}
      </Script>
    </>
  )
}
