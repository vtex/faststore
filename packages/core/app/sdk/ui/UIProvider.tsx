'use client'

import { UIProvider as UIProviderWrapper } from '@faststore/ui'

export default function UIProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <UIProviderWrapper>{children}</UIProviderWrapper>
}
