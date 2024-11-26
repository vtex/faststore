import { ProductSearchResult } from '@faststore/api'
import { api, storeUrl } from '../../../discovery.config'

const IS_PROD = process.env.NODE_ENV === 'production'

export async function fetcher(skuId: string) {
  const base = IS_PROD
    ? storeUrl
    : `https://${api.storeId}.${api.environment}.com.br`
  const url = new URL(`${base}/api/io/_v/api/intelligent-search/product_search`)
  url.searchParams.append('query', `sku.id:${skuId}`)
  if (IS_PROD) {
    url.searchParams.append('workspace', 'chrs')
  }

  return fetch(url.toString()).then((res) =>
    res.json()
  ) as Promise<ProductSearchResult>
}
