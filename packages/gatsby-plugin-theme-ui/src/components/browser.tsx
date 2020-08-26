import React, { FC, lazy, Suspense } from 'react'

const BaseProvider = lazy(() => import('./provider'))

export const ThemeProvider: FC = ({ children }) => (
  <Suspense fallback={null}>
    <BaseProvider>{children}</BaseProvider>
  </Suspense>
)
