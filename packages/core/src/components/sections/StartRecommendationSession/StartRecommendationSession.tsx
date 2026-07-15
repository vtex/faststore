import { useStartRecommendationSession } from 'src/sdk/analytics/hooks/useStartRecommendationSession'

/**
 * CMS Global Section that starts the anonymous VTEX Recommendations
 * personalization session once per browser session.
 *
 * Add this section once under Global Sections so merchants can enable
 * Recommendations without changing store code. Renders nothing.
 */
function StartRecommendationSession() {
  useStartRecommendationSession()
  return null
}

StartRecommendationSession.$componentKey = 'StartRecommendationSession'

export default StartRecommendationSession
