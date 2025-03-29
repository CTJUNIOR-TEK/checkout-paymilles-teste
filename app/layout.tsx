import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PAYMIDIAS',
  description: 'checkout teste',
  generator: 'tosi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
