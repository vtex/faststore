import type { SearchState } from '@vtex/faststore-sdk'
import { gql } from '../../@generated/gql'
import type {
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '../../@generated/graphql'
import { ITEMS_PER_PAGE } from '../constants'
import { execute } from '../server'
import storeConfig from '../../discovery.config'

export const query = gql(`
  query ServerManyProductsQuery(
    $first: Int!
    $after: String
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
    $sponsoredCount: Int
  ) {
    ...ClientManyProducts
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      sponsoredCount: $sponsoredCount
    ) {
      products {
        pageInfo {
          totalCount
        }
        edges {
          node {
            ...ProductSummary_product
          }
        }
      }
      metadata {
        ...SearchEvent_metadata
      }
    }
  }
`)

export async function fetchServerManyProducts({
  itemsPerPage = ITEMS_PER_PAGE,
  sort = 'score_desc',
  term = '',
  selectedFacets = [],
  sponsoredCount = 3,
  filter = true,
}: {
  itemsPerPage: number
  sort: SearchState['sort']
  term: string
  selectedFacets?: {
    key: string
    value: string
  }[]
  sponsoredCount?: number
  filter?: boolean
}) {
  let { channel, locale } = storeConfig.session

  if (filter) {
    const { hasOnlyDefaultSalesChannel, ...filteredChannel } =
      JSON.parse(channel)
    channel = JSON.stringify(filteredChannel)
  }

  try {
    const variables: ServerManyProductsQueryQueryVariables = {
      first: itemsPerPage,
      after: (itemsPerPage * 0).toString(),
      sort,
      term,
      selectedFacets: [
        ...selectedFacets,
        { key: 'channel', value: channel ?? '' },
        { key: 'locale', value: locale },
      ],
      sponsoredCount,
    }

    const result = await execute<
      ServerManyProductsQueryQueryVariables,
      ServerManyProductsQueryQuery
    >({
      variables,
      operation: query,
    })

    // The resultVariables is used as cache key in useCreateUseGalleryPage hook of frontend, that's why it is passed to the front as props.
    // The facets order here is important, although we use deepEquals in frontend, this order can influence the key of the cache mechanism.
    const resultVariables = {
      ...variables,
      selectedFacets: [
        ...selectedFacets,
        {
          key: 'fuzzy',
          value: result.data.search.metadata?.fuzzy ?? 'auto',
        },
        {
          key: 'operator',
          value: result.data.search.metadata?.logicalOperator ?? 'and',
        },
        { key: 'channel', value: channel ?? '' },
        { key: 'locale', value: locale },
      ],
      sponsoredCount,
    }

    return [result.data, resultVariables] as [
      ServerManyProductsQueryQuery,
      ServerManyProductsQueryQueryVariables,
    ]
  } catch (error) {
    console.error(error)
  }
}
