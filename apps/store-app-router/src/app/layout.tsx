import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}
