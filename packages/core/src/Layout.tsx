import { useMemo, type PropsWithChildren, type ReactElement } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'
import useGeolocation from 'src/sdk/geolocation/useGeolocation'

function Layout({ children }: PropsWithChildren) {
  const props = useMemo(() => (children as ReactElement)?.props, [])
  usePageViewEvent(props)
  useGeolocation()

  return <>{children}</>
}

export default Layout
