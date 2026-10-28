import { describe, expect, it, vi } from 'vitest'

import { isNotFoundError } from '../../../../../src/platforms/errors'
import { getSkuLoader } from '../../../../../src/platforms/vtex/loaders/sku'

const makeLoader = (productsByIdentifier: ReturnType<typeof vi.fn>) =>
  getSkuLoader(
    { flags: {} } as any,
    {
      search: { productsByIdentifier },
    } as any
  )

describe('skuLoader', () => {
  it('asks the search client to rethrow upstream failures', async () => {
    const productsByIdentifier = vi.fn().mockResolvedValue([])

    await makeLoader(productsByIdentifier)
      .load('1')
      .catch(() => {})

    expect(productsByIdentifier).toHaveBeenCalledWith(
      expect.objectContaining({ throwOnUpstreamError: true })
    )
  })

  it('rejects with NotFoundError when the SKU is missing', async () => {
    const error = await makeLoader(vi.fn().mockResolvedValue([]))
      .load('1')
      .catch((reason) => reason)

    expect(isNotFoundError(error)).toBe(true)
  })

  it('does not turn an upstream failure into NotFoundError', async () => {
    const failure = new Error('Service Unavailable')
    const error = await makeLoader(vi.fn().mockRejectedValue(failure))
      .load('1')
      .catch((reason) => reason)

    expect(error).toBe(failure)
    expect(isNotFoundError(error)).toBe(false)
  })
})
