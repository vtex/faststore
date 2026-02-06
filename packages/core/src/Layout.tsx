import { useMemo, type PropsWithChildren, type ReactElement } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  const props = useMemo(
    () => (children as ReactElement | undefined)?.props,
    [children]
  )
  usePageViewEvent(props)

  return <>{children}</>
}

export default Layout
