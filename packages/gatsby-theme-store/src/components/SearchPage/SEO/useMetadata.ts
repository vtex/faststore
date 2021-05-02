import { graphql, useStaticQuery } from 'gatsby'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import type { SearchPageProps } from '../../../templates/search'
import type { SearchPageSeoQueryQuery } from './__generated__/SearchPageSEOQuery.graphql'
/**
 * One should use either noindex or canonical, never both

* This deduplicates pages so our pages rank higher in Google
*/
type Options = SearchPageProps

export const useMetadata = (
  options: Options
): ComponentPropsWithoutRef<typeof GatsbySeo> => {
  const {
    site: { siteMetadata },
  } = useStaticQuery<SearchPageSeoQueryQuery>(
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

  const {
    data: {
      vtex: { searchMetadata },
    },
  } = options

  const title = searchMetadata?.title || siteMetadata.title
  const description = searchMetadata?.description || siteMetadata.description

  return {
    ...siteMetadata,
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
    },
  }
}
