import DataLoader from 'dataloader'

import { BadRequestError } from '../utils/errors'
import { enhanceSku } from '../utils/enhanceSku'
import type { EnhancedSku } from '../utils/enhanceSku'
import type { Options } from '..'
import type { Clients } from '../clients'
import type { SelectedFacet } from '../utils/facets'

export const getSkuLoader = (_: Options, clients: Clients) => {
  const loader = async (facetsList: readonly SelectedFacet[][]) => {
    const skuIds = facetsList.map((facets) => {
      const maybeFacet = facets.find(({ key }) => key === 'id')

      if (!maybeFacet) {
        throw new BadRequestError(
          'Error while loading SKU. Needs to pass an id to selected facets'
        )
      }

      return maybeFacet.value
    })

    const { products } = await clients.search.products({
      query: `sku:${skuIds.join(';')}`,
      page: 0,
      count: skuIds.length,
    })

    const skuBySkuId = products.reduce((acc, product) => {
      for (const sku of product.skus) {
        acc[sku.id] = enhanceSku(sku, product)
      }

      return acc
    }, {} as Record<string, EnhancedSku>)

    const skus = skuIds.map((skuId) => skuBySkuId[skuId])
    const missingSkus = skus.filter((sku) => !sku)

    if (missingSkus.length > 0) {
      throw new Error(
        `Search API did not return the following skus: ${missingSkus.join(',')}`
      )
    }

    return skus
  }

  return new DataLoader<SelectedFacet[], EnhancedSku>(loader, {
    maxBatchSize: 99, // Max allowed batch size of Search API
  })
}
