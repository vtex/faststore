import { gql } from '@vtex/graphql-utils'
import { useEffect, useState } from 'react'
import { useSession } from '@faststore/sdk'

import UISuggestions from 'src/components/ui/Search/Suggestions'
import { request } from 'src/sdk/graphql/request'
import type {
  SearchSuggestionsQueryQuery,
  SearchSuggestionsQueryQueryVariables,
} from '@generated/graphql'
import type { SuggestionsProps } from 'src/components/ui/Search/Suggestions'

const SearchSuggestionsQuery = gql`
  query SearchSuggestionsQuery(
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]
  ) {
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
        products {
          ...ProductSummary_product
        }
      }
    }
  }
`

function useSuggestions(term: string) {
  const { channel, locale } = useSession()
  const [suggestions, setSuggestions] =
    useState<SearchSuggestionsQueryQuery['search']['suggestions']>()

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (term.length > 0) {
      setLoading(true)
      request<
        SearchSuggestionsQueryQuery,
        SearchSuggestionsQueryQueryVariables
      >(SearchSuggestionsQuery, {
        term,
        selectedFacets: [
          { key: 'channel', value: channel ?? '' },
          { key: 'locale', value: locale },
        ],
      })
        .then((data) => {
          setSuggestions(data.search.suggestions)
        })
        .finally(() => setLoading(false))
    }
  }, [channel, locale, term])

  const terms = suggestions?.terms ?? []
  const products = suggestions?.products ?? []

  return { terms, products, loading }
}

function Suggestions({ term = '', ...otherProps }: SuggestionsProps) {
  const { terms, products, loading } = useSuggestions(term)

  if (term.length === 0 && !loading) {
    return <p>Top Search List</p>
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <UISuggestions
      term={term}
      terms={terms}
      products={products}
      {...otherProps}
    />
  )
}

export default Suggestions
