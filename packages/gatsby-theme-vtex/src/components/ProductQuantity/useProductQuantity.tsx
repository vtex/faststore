import { gql } from '@vtex/gatsby-plugin-graphql'

// import { useQuery } from '../../sdk/graphql/useQuery'
// import {
//   ProductQuantityQuery,
//   ProductQuantityQueryQuery,
//   ProductQuantityQueryQueryVariables,
// } from './__generated__/ProductQuantityQuery.graphql'

interface Props {
  slug: string
  suspense?: boolean
}

const useProductQuantity = ({ slug, suspense = false }: Props) => {
  // const { data } = useQuery<
  //   ProductQuantityQueryQuery,
  //   ProductQuantityQueryQueryVariables
  // >({
  //   ...ProductQuantityQuery,
  //   variables: { slug },
  //   suspense,
  // })

  return {
    minValue: 1,
    maxValue: 12,
  }
}

export const query = gql`
  query ProductQuantityQuery($slug: String) {
    vtex {
      product(slug: $slug) {
        productName
      }
    }
  }
`

export default useProductQuantity
