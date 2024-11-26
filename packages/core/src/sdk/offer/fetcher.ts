import { ProductSearchResult } from '@faststore/api'
import { api, secureSubdomain } from '../../../discovery.config'

export async function fetcher(skuId: string) {
  const base =
    process.env.NODE_ENV === 'development'
      ? `https://${api.storeId}.${api.environment}.com.br`
      : secureSubdomain
  const url = new URL(`${base}/api/io/_v/api/intelligent-search/product_search`)
  url.searchParams.append('query', `sku.id:${skuId}`)
  url.searchParams.append('workspace', 'chrs')

  return fetch(url.toString()).then((res) =>
    res.json()
  ) as Promise<ProductSearchResult>
}
