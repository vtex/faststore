import Head from 'next/head'
import type { ReactNode } from 'react'

export default function useServerHeadComponents(components: ReactNode) {
  if (!components) {
    return null
  }

  return <Head>{components}</Head>
}
