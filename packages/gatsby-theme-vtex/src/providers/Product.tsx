import { gql } from '@vtex/gatsby-plugin-graphql'
import { Product } from '@vtex/gatsby-source-vtex'
import { useMemo } from 'react'

import { useQuery } from '../hooks/useQuery'
import {
  AsyncProductQuery,
  AsyncProductQueryQuery,
  AsyncProductQueryQueryVariables,
} from './__generated__/AsyncProductQuery.graphql'

export type AsyncProduct = Product

export const query = gql`
  query AsyncProductQuery($slug: String) {
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

export const useAsyncProduct = (slug: string) => {
  const { data, isValidating } = useQuery<
    AsyncProductQueryQuery,
    AsyncProductQueryQueryVariables
  >({
    ...AsyncProductQuery,
    variables: { slug },
    suspense: false,
  })

  const isLoading = !data && isValidating
  const product = data?.vtex.product ?? null

  return { product, isLoading }
}

export const useSku = (product: AsyncProduct | null, skuId?: string) => {
  return useMemo(() => {
    if (!product) {
      return
    }

    return (
      product.items.find(({ itemId }) => itemId === skuId) ?? product.items[0]
    )
  }, [product, skuId])
}
