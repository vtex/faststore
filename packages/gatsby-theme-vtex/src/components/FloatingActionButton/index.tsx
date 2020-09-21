import React, { FC, lazy } from 'react'

import SuspenseSSR from '../Suspense/SSR'

const FAButton = lazy(() => import('./FAButton'))

interface Props {
  variant?: string
  href?: string
}

const FloatingActionButton: FC<Props> = ({
  variant = 'floatingActionButton',
  href = '/',
}) => (
  <SuspenseSSR fallback={null}>
    <FAButton variant={variant} href={href} />
  </SuspenseSSR>
)

export default FloatingActionButton
