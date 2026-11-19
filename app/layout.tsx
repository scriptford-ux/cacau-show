import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import FacebookPixel from '@/components/FacebookPixel'
import PresenceTracker from '@/components/PresenceTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CacauShow - Chocolates Finos',
  description: 'Os melhores chocolates do Brasil. Panettones, trufas, bombons e muito mais.',
  keywords: 'chocolate, cacau show, panettone, trufas, bombons, presente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <FacebookPixel />
        <PresenceTracker />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
