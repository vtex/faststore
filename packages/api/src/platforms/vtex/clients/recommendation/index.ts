import type { GraphqlContext } from '../..'
import { getStoreCookie, getWithCookie } from '../../utils/cookies'
import { fetchAPI } from '../fetch'
import type {
  RecommendationResult,
  StartRecommendationSessionResult,
} from './types/RecommendationResult'

// Identifies the storefront origin to the Recommendations BFF, as required by
// the API (`x-vtex-rec-origin` header).
const REC_ORIGIN_SUFFIX = 'storefront/faststore.recommendation-shelf@v4'

export interface RecommendationArgs {
  campaignVrn: string
  userId?: string
  products?: string[]
  salesChannel?: string
  locale?: string
}

export const Recommendation = (
  { account, environment }: Options,
  ctx: GraphqlContext
) => {
  const base = `https://${account}.${environment}.com.br/api/recommend-bff/v2`
  const withCookie = getWithCookie(ctx)
  const storeCookies = getStoreCookie(ctx)

  const headers: HeadersInit = withCookie({
    accept: 'application/json',
    'content-type': 'application/json',
    'x-vtex-rec-origin': `${account}/${REC_ORIGIN_SUFFIX}`,
  })

  const recommendations = ({
    campaignVrn,
    userId,
    products = [],
    salesChannel,
    locale,
  }: RecommendationArgs): Promise<RecommendationResult> => {
    const params = new URLSearchParams({ an: account, campaignVrn })

    if (userId) {
      params.append('userId', userId)
    }

    if (products.length > 0) {
      params.append('products', products.join(','))
    }

    if (salesChannel) {
      params.append('salesChannel', salesChannel)
    }

    if (locale) {
      params.append('locale', locale)
    }

    return fetchAPI(`${base}/recommendations?${params.toString()}`, { headers })
  }

  // Starts/updates the anonymous personalization session. The BFF resolves the
  // orderForm from the forwarded `checkout.vtex.com` cookie and replies with the
  // `vtex-rec-user-id`/`vtex-rec-user-start-session` Set-Cookie headers, which we
  // forward to the browser through `ctx.storage.cookies`.
  const startRecommendationSession = (): Promise<
    StartRecommendationSessionResult | undefined
  > => {
    const params = new URLSearchParams({ an: account })

    return fetchAPI(
      `${base}/users/start-session?${params.toString()}`,
      { method: 'POST', headers },
      { storeCookies }
    )
  }

  return {
    recommendations,
    startRecommendationSession,
  }
}
