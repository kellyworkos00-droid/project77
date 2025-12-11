import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'PinBoard - Real Social Connection',
  description: 'A social media platform where real connections stick. Share, connect, and engage through digital bulletin boards.',
  keywords: 'social media, bulletin board, community, connections, messaging, streaks',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PinBoard',
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://project77-ten.vercel.app'),
  other: {
    'theme-color': '#7c3aed',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no' as const,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
        <script src="/register-sw.js" async />
      </body>
    </html>
  )
}
