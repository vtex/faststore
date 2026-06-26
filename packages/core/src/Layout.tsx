import { isValidElement, type PropsWithChildren } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'
import { useStartRecommendationSession } from './sdk/analytics/hooks/useStartRecommendationSession'

function Layout({ children }: PropsWithChildren) {
  const props = isValidElement(children) ? children.props : undefined
  usePageViewEvent(props)
  // Implemented here because the personalization session must be initiated once
  // per browser session on each page.
  useStartRecommendationSession()

  return <>{children}</>
}

export default Layout
