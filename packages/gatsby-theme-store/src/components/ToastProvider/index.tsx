import React, { Suspense, lazy } from 'react'
import type { FC } from 'react'

const loader = () => import('@vtex/store-ui/src/ToastMessage/ToastProvider')

const ToastProvider = lazy(loader)

export const Provider: FC = ({ children }) => {
  return (
    <Suspense fallback={null}>
      <ToastProvider>{children}</ToastProvider>
    </Suspense>
  )
}
