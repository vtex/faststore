import { useEffect, useState } from 'react'

import { gql } from '@generated'
import type {
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables,
} from '@generated/graphql'

import { request } from '../graphql/request'
import { useSession } from '../session'

const query = gql(`
  query ClientBulkProductQuery($locator: [IStoreSelectedFacet!]!) {
    product(locator: $locator) {
      ...ProductDetailsFragment_product
    }
  }
`)

export interface BulkProductData {
  sku: string
  product?: ClientProductQueryQuery['product']
  error?: Error
}

export const useBulkProductsQuery = (skus: string[]) => {
  const { channel, locale } = useSession()
  const [products, setProducts] = useState<BulkProductData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (skus.length === 0) {
      setProducts([])
      setIsLoading(false)
      return
    }

    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (!channel) {
          throw new Error(
            `useBulkProductsQuery: 'channel' from session is an empty string.`
          )
        }

        const productPromises = skus.map(
          async (sku): Promise<BulkProductData> => {
            try {
              const variables: ClientProductQueryQueryVariables = {
                locator: [
                  { key: 'id', value: sku },
                  { key: 'channel', value: channel },
                  { key: 'locale', value: locale },
                ],
              }

              const data = await request<
                ClientProductQueryQuery,
                ClientProductQueryQueryVariables
              >(query, variables)

              return {
                sku,
                product: data.product,
              }
            } catch (err) {
              return {
                sku,
                error:
                  err instanceof Error
                    ? err
                    : new Error('Failed to fetch product'),
              }
            }
          }
        )

        const results = await Promise.all(productPromises)
        setProducts(results)
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch products')
        )
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [skus.join(','), channel, locale])

  return { products, isLoading, error }
}
