import { type PropsWithChildren } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  usePageViewEvent()

  return <>{children}</>
}

export default Layout
