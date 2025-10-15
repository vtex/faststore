import type { Metadata } from 'next'
import { ClientLayout } from './layout.client'
import './theme'

export const metadata: Metadata = {
  title: 'FastStore Starter | FastStore',
  description: 'A fast and performant store framework',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
