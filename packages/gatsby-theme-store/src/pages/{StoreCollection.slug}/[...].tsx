import { gql } from '@vtex/gatsby-plugin-graphql'
import React from 'react'
import type { FC } from 'react'
import type { PageProps as GatsbyPageProps } from 'gatsby'

import HybridWrapper from '../../components/HybridWrapper'
import Layout from '../../components/Layout'
import SearchView from '../../views/search'
import AboveTheFoldPreview from '../../views/search/AboveTheFoldPreview'
import { useQuery } from '../../sdk/graphql/useQuery'
import { useQueryVariablesFromSearchParams } from '../../sdk/search/converter/useQueryVariablesFromSearchParams'
import { useSearchParamsFromUrl } from '../../sdk/search/converter/useSearchParamsFromURL'
import { usePersonalizedSearchRedirect } from '../../sdk/search/usePersonalizedSearchRedirect'
import { BrowserCollectionPageQuery } from '../../{StoreCollection.slug}/__generated__/BrowserCollectionPageQuery.graphql'
import type {
  BrowserCollectionPageQueryQuery,
  BrowserCollectionPageQueryQueryVariables,
} from '../../{StoreCollection.slug}/__generated__/BrowserCollectionPageQuery.graphql'

const SearchPage: FC<PageProps> = (props) => {
  const {
    pageContext: { hideUnavailableItems, pageInfo },
    pageContext,
    location,
  } = props

  const searchParams = useSearchParamsFromUrl(location)
  const variables = useQueryVariablesFromSearchParams(searchParams, pageInfo)
  const redirecting = usePersonalizedSearchRedirect(searchParams)

  const { data } = useQuery<
    BrowserCollectionPageQueryQuery,
    BrowserCollectionPageQueryQueryVariables
  >({
    ...BrowserCollectionPageQuery,
    variables: { ...variables, hideUnavailableItems },
    suspense: true,
  })

  if (data == null) {
    throw new Error('Something went wrong while fetching the data')
  }

  /** Search result is not regionalized. We need to wait for the redirect */
  if (redirecting === true) {
    return <AboveTheFoldPreview />
  }

  return (
    <SearchView
      {...props}
      data={data}
      searchParams={searchParams}
      pageContext={pageContext}
      pageInfo={pageInfo}
    />
  )
}

type PageProps = GatsbyPageProps<
  null,
  {
    hideUnavailableItems?: boolean
    from?: number
    to?: number
    canonicalPath: string
    pageInfo: { size: number }
  }
>

const Page: FC<PageProps> = (props) => (
  <Layout>
    <HybridWrapper fallback={<AboveTheFoldPreview />}>
      <SearchPage {...props} />
    </HybridWrapper>
  </Layout>
)

export const query = gql`
  query BrowserCollectionPageQuery(
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
