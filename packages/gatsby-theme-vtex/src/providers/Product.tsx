import { gql } from '@vtex/gatsby-plugin-graphql'
import { Product } from '@vtex/gatsby-source-vtex'
import { useMemo } from 'react'
import useSWR from 'swr'

import { graphqlFetcher } from '../utils/fetcher'

export type AsyncProduct = Product

const query = gql`
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
  const { data, isValidating } = useSWR<AsyncProduct>(
    `${slug}?AsyncProductQuery`,
    {
      fetcher: (s: string) =>
        graphqlFetcher({
          operationName: 'AsyncProductQuery',
          variables: {
            slug: s,
          },
        }).then((r) => r.data.vtex.product),
      suspense: false,
    }
  )

  const isLoading = !data && isValidating
  const product = data ?? null

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
