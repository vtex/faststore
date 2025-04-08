import type { PropsWithChildren, ReactElement } from 'react'
import { usePageViewEvent } from 'src/sdk/analytics/hooks/usePageViewEvent'
import { useRegionModal } from './components/region/RegionModal/useRegionModal'

const Layout = function Layout({ children }: PropsWithChildren) {
  usePageViewEvent((children as ReactElement)?.props)
  useRegionModal()

  return <>{children}</>
}

export default Layout
