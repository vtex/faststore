import { graphql } from 'gatsby'
import React from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import Layout from '../components/Layout'
import SearchView from '../components/SearchPage'
import AboveTheFoldPreview from '../components/SearchPage/AboveTheFoldPreview'
import { useSearchParamsFromQueryVariables } from '../sdk/search/converter/useSearchParamsFromQueryVariables'
import { usePersonalizedSearchRedirect } from '../sdk/search/usePersonalizedSearchRedirect'
import type {
  ServerSearchPageQueryQuery,
  ServerSearchPageQueryQueryVariables,
} from './__generated__/ServerSearchPageQuery.graphql'

export type SearchPageProps = PageProps<
  ServerSearchPageQueryQuery,
  ServerSearchPageQueryQueryVariables & {
    canonicalPath: string
  }
>

const Page: FC<SearchPageProps> = ({ pageContext, data }) => {
  /**
   * In the future, we won't need this hook since in the ideal word our API
   * uses the same parameters as the output of this hook, so our searchParams can
   * be serialized directly into the searchParams
   */
  const searchParams = useSearchParamsFromQueryVariables(pageContext)
  const redirecting = usePersonalizedSearchRedirect(searchParams)

  return (
    <Layout>
      {
        /** We still do not support search personalization with SSR */
        redirecting === true ? (
          <AboveTheFoldPreview />
        ) : (
          <SearchView
            data={data}
            searchParams={searchParams}
            pageContext={pageContext}
          />
        )
      }
    </Layout>
  )
}

export const query = graphql`
  query ServerSearchPageQuery(
    $from: Int = 0
    $to: Int = 11
    $fullText: String
    $selectedFacets: [VTEX_SelectedFacetInput!]
    $orderBy: String = ""
    $hideUnavailableItems: Boolean = false
  ) {
    vtex {
      productSearch(
        from: $from
        to: $to
        hideUnavailableItems: $hideUnavailableItems
        simulationBehavior: skip
        orderBy: $orderBy
        fullText: $fullText
        selectedFacets: $selectedFacets
      ) {
        products {
          id: productId
          productName
          linkText
          items {
            itemId
            images {
              imageUrl
              imageText
            }
          }
        }
        recordsFiltered
      }
      searchMetadata(fullText: $fullText, selectedFacets: $selectedFacets) {
        title: titleTag
        description: metaTagDescription
      }
      facets(
        fullText: $fullText
        selectedFacets: $selectedFacets
        operator: or
        behavior: "Static"
        removeHiddenFacets: true
      ) {
        breadcrumb {
          href
          name
        }
        facets {
          name
          type
          values {
            key
            name
            value
            selected
            quantity
            range {
              from
              to
            }
          }
        }
      }
    }
  }
`

export default Page
