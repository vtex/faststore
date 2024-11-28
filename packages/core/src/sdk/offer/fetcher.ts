import { ProductSearchResult } from '@faststore/api'
import { api, storeUrl } from '../../../discovery.config'

const IS_PROD = process.env.NODE_ENV === 'production'

export function getUrl(skuId: string) {
  const base = IS_PROD
    ? storeUrl
    : `https://${api.storeId}.${api.environment}.com.br`
  const url = new URL(`${base}/api/io/_v/api/intelligent-search/product_search`)
  url.searchParams.append('query', `sku.id:${skuId}`)
  if (IS_PROD) {
    url.searchParams.append('workspace', 'chrs')
  }

  return url.toString()
}

export async function fetcher(skuId: string) {
  return fetch(getUrl(skuId)).then((res) =>
    res.json()
  ) as Promise<ProductSearchResult>
}
