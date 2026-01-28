import type { ProductSearchResult } from '@faststore/api'
import { api } from '../../../discovery.config'
import { getStoreURL } from '../localization/useLocalizationConfig'

const IS_PROD = process.env.NODE_ENV === 'production'

export function getUrl(skuId: string) {
  const base = IS_PROD
    ? getStoreURL()
    : `https://${api.storeId}.${api.environment}.com.br`
  const url = new URL(`${base}/api/intelligent-search/product_search`)
  url.searchParams.append('query', `sku.id:${skuId}`)
  return url.toString()
}

export async function fetcher(skuId: string) {
  return fetch(getUrl(skuId)).then((res) =>
    res.json()
  ) as Promise<ProductSearchResult>
}
