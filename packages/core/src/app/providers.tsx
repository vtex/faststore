'use client'

import type { PropsWithChildren } from 'react'
import { UIProvider } from '@faststore/ui'

export function Providers(props: PropsWithChildren) {
  const { children } = props

  return <UIProvider>{children}</UIProvider>
}
