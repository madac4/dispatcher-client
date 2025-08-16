import { Providers } from '@/components/providers/providers'
import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Dispatcher',
  description: 'Dispatcher',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} antialiased`}>
        <Providers>
          <Toaster richColors position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  )
}
