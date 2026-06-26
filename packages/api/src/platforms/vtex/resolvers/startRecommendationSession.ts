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
  await ctx.clients.recommendation.startSession()

  return true
}
