import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { CartHydrator } from '@/components/CartHydrator'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawerWrapper } from '@/components/layout/CartDrawerWrapper'
import { WhatsAppButton, WhatsAppButtonMobile } from '@/components/layout/WhatsAppButton'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/ui/PageTransition'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { CartProvider } from '@/components/providers/CartProvider'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://brothersfashionzone.com'),
  title: "Brother's Fashion Zone — Premium Ethnic & Western Fashion India",
  description: 'Shop premium ethnic wear, kurtas, sarees, western fashion and accessories. Pan India delivery from Nani Daman. Prepaid orders only.',
  openGraph: {
    title: "Brother's Fashion Zone — Premium Ethnic & Western Fashion India",
    description: 'Shop premium ethnic wear, kurtas, sarees, western fashion and accessories. Pan India delivery from Nani Daman. Prepaid orders only.',
    images: ['/images/brothers-logo.jpeg'],
    url: 'https://brothersfashionzone.com',
    siteName: "Brother's Fashion Zone",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Brother's Fashion Zone — Premium Ethnic & Western Fashion India",
    description: 'Shop premium ethnic wear, kurtas, sarees, western fashion and accessories. Pan India delivery from Nani Daman.',
    images: ['/images/brothers-logo.jpeg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="font-inter antialiased">
        <Providers>
          <CartProvider>
            <CartHydrator />
            <AnnouncementBar />
            <Navbar />
            <CartDrawerWrapper />
            <WhatsAppButton />
            <WhatsAppButtonMobile />
            <CustomCursor />
            <PageTransition>
              {children}
            </PageTransition>
            <ScrollToTop />
          </CartProvider>
        </Providers>
      </body>
    </html>
  )
}
