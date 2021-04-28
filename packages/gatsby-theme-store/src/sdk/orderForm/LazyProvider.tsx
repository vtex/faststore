import type { PropsWithChildren } from 'react'
import React, { lazy, Suspense } from 'react'

const isOfflinePage = window.location.pathname.startsWith('/offline')

const LazyProvider = isOfflinePage
  ? null
  : lazy(() =>
      import('./Provider').then(({ Provider }) => ({
        default: Provider,
      }))
    )

export const Provider = ({ children }: PropsWithChildren<null>) => {
  if (LazyProvider == null) {
    return children
  }

  return (
    <Suspense fallback={null}>
      <LazyProvider>{children}</LazyProvider>
    </Suspense>
  )
}
