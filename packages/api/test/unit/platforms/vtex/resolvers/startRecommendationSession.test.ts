import { describe, expect, it, vi } from 'vitest'

import { startRecommendationSession } from '../../../../../src/platforms/vtex/resolvers/startRecommendationSession'

const makeContext = (sessionResult: unknown) => {
  const startFn = vi.fn().mockResolvedValue(sessionResult)

  return {
    ctx: {
      clients: {
        commerce: {
          recommendation: {
            startRecommendationSession: startFn,
          },
        },
      },
    } as any,
    startFn,
  }
}

describe('startRecommendationSession resolver', () => {
  it('returns true once a session has been started', async () => {
    const { ctx, startFn } = makeContext({ recommendationsUserId: 'user-1' })

    await expect(startRecommendationSession(null, null, ctx)).resolves.toBe(
      true
    )
    expect(startFn).toHaveBeenCalledTimes(1)
  })

  it('throws when the BFF returns no session payload', async () => {
    const { ctx } = makeContext(undefined)

    await expect(startRecommendationSession(null, null, ctx)).rejects.toThrow(
      /Failed to start recommendation session/
    )
  })

  it('throws when the session payload has no recommendationsUserId', async () => {
    const { ctx } = makeContext({})

    await expect(startRecommendationSession(null, null, ctx)).rejects.toThrow(
      /Failed to start recommendation session/
    )
  })
})
