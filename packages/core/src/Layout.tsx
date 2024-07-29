import { useEffect, type PropsWithChildren } from 'react'
import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

function Layout({ children }: PropsWithChildren) {
  const { sendPageViewEvent } = usePageViewEvent({})

  useEffect(sendPageViewEvent, [])

  return <>{children}</>
}

export default Layout
