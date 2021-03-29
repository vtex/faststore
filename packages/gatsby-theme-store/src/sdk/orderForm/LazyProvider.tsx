import type { PropsWithChildren } from 'react'
import React, { lazy, Suspense } from 'react'

const LazyProvider = lazy(() =>
  import('./Provider').then(({ Provider }) => ({
    default: Provider,
  }))
)

export const Provider = ({ children }: PropsWithChildren<null>) => {
  return (
    <Suspense fallback={() => children}>
      <LazyProvider>{children}</LazyProvider>
    </Suspense>
  )
}
