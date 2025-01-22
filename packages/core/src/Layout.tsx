import type { PropsWithChildren, ReactElement } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  usePageViewEvent((children as ReactElement)?.props)

  return <>{children}</>
}

export default Layout
