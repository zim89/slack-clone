import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Modals } from '@/widgets'
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import { Toaster } from '@/shared/components/ui/sonner'
import { Providers } from './providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Slack Clone',
  description: 'A Slack clone built with Next.js and Convex.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <Providers>
            <Modals />
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
