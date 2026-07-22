import { isValidElement, type PropsWithChildren } from 'react'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'
import { useStartRecommendationSession } from './sdk/analytics/hooks/useStartRecommendationSession'

function Layout({ children }: PropsWithChildren) {
  const props = isValidElement(children) ? children.props : undefined
  usePageViewEvent(props)

  // Starts the personalization session once per browser session when the page
  // CMS data includes a RecommendationShelf with `enableRecommendations: true`.
  useStartRecommendationSession(props)

  return <>{children}</>
}

export default Layout
