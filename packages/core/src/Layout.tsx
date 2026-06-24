import { isValidElement, type PropsWithChildren } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'
import { useStartSession } from './sdk/analytics/hooks/useStartSession'

function Layout({ children }: PropsWithChildren) {
  const props = isValidElement(children) ? children.props : undefined
  usePageViewEvent(props)
  // Implemented here because the personalization session must be initiated once
  // per browser session on each page.
  useStartSession()

  return <>{children}</>
}

export default Layout
