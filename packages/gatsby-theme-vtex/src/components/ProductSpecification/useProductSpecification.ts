import { gql } from '@vtex/gatsby-plugin-graphql'

import { useQuery } from '../../sdk/graphql/useQuery'
import {
  ProductSpecificationQuery,
  ProductSpecificationQueryQuery,
  ProductSpecificationQueryQueryVariables,
} from './__generated__/ProductSpecificationQuery.graphql'

interface Props {
  slug: string
  suspense?: boolean
}

const useProductSpecification = ({ slug, suspense = false }: Props) => {
  const { data } = useQuery<
    ProductSpecificationQueryQuery,
    ProductSpecificationQueryQueryVariables
  >({
    ...ProductSpecificationQuery,
    variables: { slug },
    suspense,
  })

  return {
    data: data?.vtex?.product?.specificationGroups as any,
  }
}

export const query = gql`
  query ProductSpecificationQuery($slug: String) {
    vtex {
      product(slug: $slug) {
        specificationGroups {
          name
          specifications {
            name
            values
          }
        }
      }
    }
  }
`

export default useProductSpecification
