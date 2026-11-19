'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PresenceTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Não contabiliza visitas feitas nas páginas de administração
    if (pathname && pathname.startsWith('/admin')) {
      return
    }

    // Identificador único da sessão do visitante no navegador
    let visitorId = ''
    try {
      visitorId = sessionStorage.getItem('cs_visitor_id') || ''
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
        sessionStorage.setItem('cs_visitor_id', visitorId)
      }
    } catch {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 9)
    }

    const sendHeartbeat = () => {
      try {
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            path: pathname || '/',
          }),
          keepalive: true,
        }).catch(() => {})
      } catch {
        // Silencioso em caso de erro de rede
      }
    }

    // Dispara imediatamente ao navegar
    sendHeartbeat()

    // Envia sinal a cada 15 segundos enquanto a aba estiver aberta
    const interval = setInterval(sendHeartbeat, 15000)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return null
}
