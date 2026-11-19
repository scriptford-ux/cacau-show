'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    fbq?: any
    _fbq?: any
  }
}

export default function FacebookPixel() {
  const [pixelId, setPixelId] = useState<string | null>(null)

  useEffect(() => {
    // Busca o Pixel ID configurado na API
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.facebook_pixel_id) {
          setPixelId(data.facebook_pixel_id)
        }
      })
      .catch((err) => console.error('Erro ao carregar Facebook Pixel:', err))
  }, [])

  useEffect(() => {
    if (!pixelId || typeof window === 'undefined') return

    // Inicia script do Facebook Pixel
    if (!window.fbq) {
      ;(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    }

    try {
      window.fbq('init', pixelId)
      window.fbq('track', 'PageView')
      console.log(`[Meta Pixel] Inicializado com sucesso: ${pixelId}`)
    } catch (e) {
      console.warn('Erro ao inicializar fbq:', e)
    }
  }, [pixelId])

  if (!pixelId) return null

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}
