import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../../sdk/graphql/useQuery'
import {
  ProductDescriptionQuery,
  ProductDescriptionQueryQuery,
  ProductDescriptionQueryQueryVariables,
} from './__generated__/ProductDescriptionQuery.graphql'

interface Props {
  slug: string
  suspense?: boolean
}

const useProductDescription = ({ slug, suspense = false }: Props) => {
  const { data } = useQuery<
    ProductDescriptionQueryQuery,
    ProductDescriptionQueryQueryVariables
  >({
    ...ProductDescriptionQuery,
    variables: { slug },
    suspense,
  })

  return {
    data: data?.vtex?.product?.description as string,
  }
}

export const query = gql`
  query ProductDescriptionQuery($slug: String) {
    vtex {
      product(slug: $slug) {
        description
        productName
      }
    }
  }
`

export default useProductDescription
