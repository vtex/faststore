import { useEffect, useMemo, useState } from 'react'

import { gql } from '@generated'
import type {
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables,
} from '@generated/graphql'

import { request } from '../graphql/request'
import { useSession } from '../session'

// Use the same query as useProductQuery for individual products
const query = gql(`
  query ClientProductQuery($locator: [IStoreSelectedFacet!]!) {
    ...ClientProduct
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

// Batch size to avoid overwhelming the server
const BATCH_SIZE = 10
const BATCH_DELAY_MS = 100

export const useBulkProductsQuery = (skus: string[]) => {
  const { channel, locale } = useSession()
  const [products, setProducts] = useState<BulkProductData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Create a stable key for the SKUs array to use as a dependency
  const skusKey = useMemo(() => {
    return skus.join(',')
  }, [skus])

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

        // Process SKUs in batches to avoid overwhelming the server
        // This matches the RFC recommendation to divide requests into smaller batches
        const results: BulkProductData[] = []

        for (let i = 0; i < skus.length; i += BATCH_SIZE) {
          const batch = skus.slice(i, i + BATCH_SIZE)

          // Fetch each product individually using the same query as useProductQuery
          // This matches exactly how products are fetched elsewhere in the codebase
          const batchPromises = batch.map(
            async (sku): Promise<BulkProductData> => {
              try {
                const variables: ClientProductQueryQueryVariables = {
                  locator: [
                    { key: 'id', value: sku },
                    { key: 'channel', value: channel },
                    { key: 'locale', value: locale },
                  ],
                }

                // Use POST method to avoid URL length issues with GET
                const data = await request<
                  ClientProductQueryQuery,
                  ClientProductQueryQueryVariables
                >(query, variables, {
                  fetchOptions: {
                    method: 'POST',
                  },
                })

                return {
                  sku,
                  product: data.product,
                }
              } catch (err) {
                console.error(`Failed to fetch product ${sku}:`, err)
                return {
                  sku,
                  error:
                    err instanceof Error
                      ? err
                      : new Error(`Failed to fetch product: ${sku}`),
                }
              }
            }
          )

          const batchResults = await Promise.all(batchPromises)
          results.push(...batchResults)

          // Add a small delay between batches to avoid rate limiting
          if (i + BATCH_SIZE < skus.length) {
            await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
          }
        }

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
  }, [skusKey, channel, locale, skus.length])

  return { products, isLoading, error }
}
