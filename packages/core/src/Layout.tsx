import { useMemo, type PropsWithChildren, type ReactElement } from 'react'

import { useRegionModal } from './components/region/RegionModal/useRegionModal'
import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  const props = useMemo(() => (children as ReactElement)?.props, [])
  usePageViewEvent(props)
  useRegionModal()

  return <>{children}</>
}

export default Layout
