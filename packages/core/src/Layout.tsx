import { useMemo, type PropsWithChildren, type ReactElement } from 'react'

import { useRegion } from './components/region/RegionModal/useRegion'
import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  const props = useMemo(() => (children as ReactElement)?.props, [])
  usePageViewEvent(props)
  useRegion()

  return <>{children}</>
}

export default Layout
