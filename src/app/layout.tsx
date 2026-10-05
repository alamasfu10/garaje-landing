import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'IA Aplicada en un Solo Día — Garaje Boost AI Madrid',
  description:
    'Un encuentro presencial de Garaje Boost AI para equipos de diseño, data y tecnología. Madrid, 17 de junio de 2026.',
  openGraph: {
    title: 'IA Aplicada en un Solo Día — Garaje Boost AI Madrid',
    description:
      'Un encuentro presencial de Garaje Boost AI. Una jornada para entender el contexto, reducir el ruido y activar la IA con propósito.',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
