import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import type { FC } from 'react'

import SearchSEO from '../../../components/Seo/search/SearchSEO'
import type { SearchViewProps } from '..'
import type { SearchPageSeoQueryQuery } from './__generated__/SearchPageSEOQuery.graphql'
import { useSearch } from '../../../sdk/search/useSearch'

const useCanonical = (canonicalPath: string | undefined) => {
  const { searchParams } = useSearch()

  // We still don't support canonalizing other pagination rather then the first one
  if (canonicalPath == null || searchParams.page !== 0) {
    return undefined
  }

  return canonicalPath
}

const SEO: FC<SearchViewProps> = (props) => {
  const { site } = useStaticQuery<SearchPageSeoQueryQuery>(
    graphql`
      query SearchPageSEOQuery {
        site {
          siteMetadata {
            title
            titleTemplate
            description
            author
          }
        }
      }
    `
  )

  const { siteMetadata } = site!
  const {
    data: {
      vtex: { searchMetadata, facets },
    },
    pageContext: { canonicalPath },
  } = props

  const canonical = useCanonical(canonicalPath)

  return (
    <SearchSEO
      {...siteMetadata}
      titleTemplate={siteMetadata!.titleTemplate!}
      title={searchMetadata?.title || siteMetadata!.title!}
      description={searchMetadata?.description || siteMetadata!.description!}
      canonical={canonical}
      breadcrumb={facets?.breadcrumb as any} // this can be removed once GraphQL types are correct
    />
  )
}

export default SEO
