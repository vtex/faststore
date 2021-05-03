import type { FC, PropsWithChildren } from 'react'
import React, { Fragment, lazy, Suspense } from 'react'

const isOfflinePage = window.location.pathname.startsWith('/offline')

const Noop: FC = ({ children }) => <Fragment>{children}</Fragment>

const LazyProvider = lazy(() =>
  import('./Provider')
    .then(({ Provider }) => ({
      default: Provider,
    }))
    .catch((e) => {
      if (isOfflinePage) {
        return { default: Noop }
      }

      throw e
    })
)

export const Provider = ({ children }: PropsWithChildren<null>) => {
  return (
    <Suspense fallback={null}>
      <LazyProvider>{children}</LazyProvider>
    </Suspense>
  )
}
