import { describe, expect, it, vi } from 'vitest'

import { isNotFoundError } from '../../../../../src/platforms/errors'
import type { Clients } from '../../../../../src/platforms/vtex/clients'
import { getSkuLoader } from '../../../../../src/platforms/vtex/loaders/sku'
import type { Options } from '../../../../../src/typings/globals'

const makeLoader = (productsByIdentifier: ReturnType<typeof vi.fn>) =>
  getSkuLoader(
    { flags: {} } as Options,
    {
      search: { productsByIdentifier },
    } as unknown as Clients
  )

const product = (skuId: string) => ({
  productId: `${skuId}-product`,
  productName: `Product ${skuId}`,
  items: [{ itemId: skuId, name: `SKU ${skuId}` }],
})

/** Intelligent Search client that only knows `known` SKU ids. */
const searchKnowing = (known: string[]) =>
  vi.fn(async ({ values }: { values: string[] }) =>
    values.filter((value) => known.includes(value)).map(product)
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

  it('resolves every key of a batch when Search returns all of them', async () => {
    const productsByIdentifier = searchKnowing(['1', '2'])
    const loader = makeLoader(productsByIdentifier)

    const [first, second] = await Promise.all([
      loader.load('1-invisibleItems'),
      loader.load('2-invisibleItems'),
    ])

    expect(productsByIdentifier).toHaveBeenCalledTimes(1)
    expect(first.itemId).toBe('1')
    expect(second.itemId).toBe('2')
  })

  it('rejects only the key Search did not return, not the whole batch', async () => {
    const productsByIdentifier = searchKnowing(['1'])
    const loader = makeLoader(productsByIdentifier)

    const [found, missing] = await Promise.allSettled([
      loader.load('1-invisibleItems'),
      loader.load('2-invisibleItems'),
    ])

    expect(productsByIdentifier).toHaveBeenCalledTimes(1)
    expect(found.status === 'fulfilled' && found.value.itemId).toBe('1')

    expect(missing.status).toBe('rejected')
    const reason = missing.status === 'rejected' ? missing.reason : undefined
    expect(isNotFoundError(reason)).toBe(true)
    expect(reason?.message).toBe(
      'Search API did not found the following skus: 2'
    )
  })
})
