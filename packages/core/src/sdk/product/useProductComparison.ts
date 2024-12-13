import { gql } from '@generated'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useSession } from 'src/sdk/session'
import { useMemo } from 'react'

const query = gql(`
  query ClientManyProductsComparisonQuery(
    $productIds: [String!]!
    
  ) {
    products(
      productIds: $productIds
    ) {
        ...ProductComparisonFragment_product
      }
    }  
`)

export const useProductComparison = (productIds: string[]) => {
  const { channel, locale } = useSession()
  const variables = useMemo(() => {
    if (!channel) {
      throw new Error(
        `useProductComparison: 'channel' from session is an empty string.`
      )
    }

    return { productIds }
  }, [channel, locale, productIds])

  return useQuery(query, variables, {
    onSuccess: (data) => console.log(data),
  })
}

export const fragment = gql(`
  fragment ProductComparisonFragment_product on StoreProduct {
    ...ProductDetailsFragment_product,

    skuSpecifications {
      field {
        id
        name
        originalName
      }
      values {
        name
        id
        fieldId
        originalName
      }
    }

    specificationGroups {
      name
      originalName
      specifications {
        name
        originalName
        values
      }
    }
  }
`)
