import { describe, expect, it, vi } from 'vitest'

import { isNotFoundError } from '../../../../../src/platforms/errors'
import type { Clients } from '../../../../../src/platforms/vtex/clients'
import { getSkuLoader } from '../../../../../src/platforms/vtex/loaders/sku'
import type { Options } from '../../../../../src/typings/globals'

const product = (skuId: string) => ({
  productId: `${skuId}-product`,
  productName: `Product ${skuId}`,
  items: [{ itemId: skuId, name: `SKU ${skuId}` }],
})

/** Intelligent Search client that only knows `known` SKU ids. */
const clientsKnowing = (known: string[]) => {
  const productsByIdentifier = vi.fn(async ({ values }: { values: string[] }) =>
    values.filter((value) => known.includes(value)).map(product)
  )

  return {
    clients: { search: { productsByIdentifier } } as unknown as Clients,
    productsByIdentifier,
  }
}

describe('getSkuLoader', () => {
  it('resolves every key of a batch when Search returns all of them', async () => {
    const { clients, productsByIdentifier } = clientsKnowing(['1', '2'])
    const loader = getSkuLoader({} as Options, clients)

    const [first, second] = await Promise.all([
      loader.load('1-invisibleItems'),
      loader.load('2-invisibleItems'),
    ])

    expect(productsByIdentifier).toHaveBeenCalledTimes(1)
    expect(first.itemId).toBe('1')
    expect(second.itemId).toBe('2')
  })

  it('rejects only the key Search did not return, not the whole batch', async () => {
    const { clients, productsByIdentifier } = clientsKnowing(['1'])
    const loader = getSkuLoader({} as Options, clients)

    const [found, missing] = await Promise.allSettled([
      loader.load('1-invisibleItems'),
      loader.load('2-invisibleItems'),
    ])

    expect(productsByIdentifier).toHaveBeenCalledTimes(1)
    expect(found.status).toBe('fulfilled')
    expect(found.status === 'fulfilled' && found.value.itemId).toBe('1')

    expect(missing.status).toBe('rejected')
    const reason = missing.status === 'rejected' ? missing.reason : undefined
    expect(isNotFoundError(reason)).toBe(true)
    expect(reason?.message).toBe(
      'Search API did not found the following skus: 2'
    )
  })

  it('still rejects a single missing SKU with NotFoundError', async () => {
    const { clients } = clientsKnowing([])
    const loader = getSkuLoader({} as Options, clients)

    await expect(loader.load('3')).rejects.toSatisfy(isNotFoundError)
  })
})
