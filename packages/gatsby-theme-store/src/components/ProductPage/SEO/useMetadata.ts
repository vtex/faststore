import { graphql, useStaticQuery } from 'gatsby'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import type { ProductPageProps } from '../../../templates/product'
import type { ProductPageSeoQueryQuery } from './__generated__/ProductPageSEOQuery.graphql'

/**
 * One should use either noindex or canonical, never both

* This deduplicates pages so our pages rank higher in Google
*/
type Options = ProductPageProps

export const useMetadata = (
  options: Options
): ComponentPropsWithoutRef<typeof GatsbySeo> => {
  const {
    site: { siteMetadata },
  } = useStaticQuery<ProductPageSeoQueryQuery>(
    graphql`
      query ProductPageSeoQuery {
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
