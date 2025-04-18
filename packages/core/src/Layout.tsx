import { useMemo, type PropsWithChildren, type ReactElement } from 'react'

import { useRegionManager } from './components/region/RegionModal/useRegionManager'
import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  const props = useMemo(() => (children as ReactElement)?.props, [])
  usePageViewEvent(props)
  useRegionManager()

  return <>{children}</>
}

export default Layout
