import { useMemo, type PropsWithChildren, type ReactElement } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  const props = useMemo(() => (children as ReactElement)?.props, [])
  usePageViewEvent(props)

  return <>{children}</>
}

export default Layout
