import type { Metadata, Viewport } from 'next'
import './globals.css'
import SplashScreen from '@/components/SplashScreen'

export const metadata: Metadata = {
  title: 'TAKENI - טכנאי עכשיו, מכל סוג',
  description: 'שירות טכנאים מהיר לביתך - חשמל, אינסטלציה, מנעול, מזגן ועוד. טכנאי מגיע עד 20 דקות.',
  keywords: 'טכנאי, חשמלאי, אינסטלטור, מנעולן, מזגן, תיקונים, תל אביב',
  authors: [{ name: 'TAKENI' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-bg-dark text-white antialiased">
        <div className="min-h-screen flex flex-col">
          <SplashScreen />
          {children}
        </div>
      </body>
    </html>
  )
}
