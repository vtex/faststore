import React, { FC, lazy } from 'react'

import SuspenseViewport from './Suspense/Viewport'
import ErrorBoundary from './Error/ErrorBoundary'
import ErrorHandler from './Error/ErrorHandler'
import Header from './Header'

const loader = () => import('./Footer')

const Footer = lazy(loader)

const Layout: FC = ({ children }) => (
  <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
    <Header />
    {children}
    <SuspenseViewport fallback={null} preloader={loader}>
      <Footer />
    </SuspenseViewport>
  </ErrorBoundary>
)

export default Layout
