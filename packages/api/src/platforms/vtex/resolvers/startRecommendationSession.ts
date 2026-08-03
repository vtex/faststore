import type { GraphqlContext } from '../index'

/**
 * Starts (or updates) the anonymous personalization session for the current
 * shopper via the Recommendations BFF.
 *
 * The BFF replies with the `vtex-rec-user-id`/`vtex-rec-user-start-session`
 * Set-Cookie headers, which the client forwards to the browser through
 * `ctx.storage.cookies`. Returns `true` once the session has been started.
 */
export const startRecommendationSession = async (
  _: unknown,
  __: unknown,
  ctx: GraphqlContext
) => {
  const result =
    await ctx.clients.commerce.recommendation.startRecommendationSession()

  // The BFF may not be ready on the first call and can resolve without a
  // session payload. Only report success once a session actually exists (its
  // `recommendationsUserId`); otherwise surface an error so the caller retries
  // instead of treating an empty response as a started session.
  if (!result?.recommendationsUserId) {
    throw new Error(
      'Failed to start recommendation session: no session data returned'
    )
  }

  return true
}
