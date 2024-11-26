import { ProductSearchResult } from '@faststore/api'
import { api } from '../../../discovery.config'

export async function fetcher(skuId: string) {
  const url = new URL(
    `https://${api.storeId}.${api.environment}.com.br/api/io/_v/api/intelligent-search/product_search`
  )
  url.searchParams.append('query', `sku.id:${skuId}`)
  url.searchParams.append('workspace', 'chrs')

  return fetch(url.toString()).then((res) =>
    res.json()
  ) as Promise<ProductSearchResult>
}
