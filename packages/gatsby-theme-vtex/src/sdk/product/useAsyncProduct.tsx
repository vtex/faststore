import { gql } from '@vtex/gatsby-plugin-graphql'
import { useMemo } from 'react'

import {
  useAsyncProductQuery,
  UseAsyncProductQueryQuery,
  UseAsyncProductQueryQueryVariables,
} from './__generated__/useAsyncProductQuery.graphql'
import { useQuery } from '../graphql/useQuery'

export const useAsyncProduct = (slug: string) => {
  const { data, isValidating } = useQuery<
    UseAsyncProductQueryQuery,
    UseAsyncProductQueryQueryVariables
  >({
    ...useAsyncProductQuery,
    variables: { slug },
    suspense: false,
  })

  const isLoading = !data && isValidating
  const product = data?.vtex.product ?? null

  return { product, isLoading }
}

export const useSku = (
  product: UseAsyncProductQueryQuery['vtex']['product'] | null,
  skuId?: string
) =>
  useMemo(() => {
    if (!product) {
      return
    }

    return (
      product.items!.find((sku) => sku?.itemId === skuId) ?? product.items![0]
    )
  }, [product, skuId])

export const query = gql`
  query useAsyncProductQuery($slug: String) {
    vtex {
      product(slug: $slug) {
        productId
        productName
        description
        linkText
        items {
          itemId
          images {
            imageUrl
            imageText
          }
          sellers {
            commertialOffer {
              AvailableQuantity
              ListPrice
              Price
            }
          }
        }
      }
    }
  }
`
