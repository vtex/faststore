import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import { useLocale } from '../../../sdk/localization/useLocale'
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
  const language = useLocale()
  const { host } = useLocation()
  const {
    site: { siteMetadata },
  }: any = useStaticQuery<SearchPageSeoQueryQuery>(
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
    pageContext: { canonicalPath },
  }: any = options

  const title = searchMetadata?.title || siteMetadata.title
  const description = searchMetadata?.description || siteMetadata.description

  const canonical =
    typeof canonicalPath === 'string'
      ? {
          canonical: `https://${host}${canonicalPath}`,
          noindex: false,
          nofollow: false,
        }
      : { canonical: undefined, noindex: true, nofollow: false }

  return {
    ...siteMetadata,
    ...canonical,
    language,
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
    },
  }
}
