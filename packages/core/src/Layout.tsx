import { isValidElement, type PropsWithChildren } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'
import { useStartRecommendationSession } from './sdk/analytics/hooks/useStartRecommendationSession'

function Layout({ children }: PropsWithChildren) {
  const props = isValidElement(children) ? children.props : undefined
  usePageViewEvent(props)
  // Implemented here because the personalization session must be initiated once
  // per browser session on each page. Gated behind the
  // `experimental.enableRecommendations` flag: stores that don't opt into
  // Recommendations never start a session nor call the Recommendations API.
  useStartRecommendationSession()

  return <>{children}</>
}

export default Layout
