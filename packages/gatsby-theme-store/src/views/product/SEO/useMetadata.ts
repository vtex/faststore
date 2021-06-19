import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import { useMemo } from 'react'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import { useLocale } from '../../../sdk/localization/useLocale'
import type { ProductPageSeoQueryQuery } from './__generated__/ProductPageSEOQuery.graphql'
import type { ProductViewProps } from '../index'

/**
 * One should use either noindex or canonical, never both

* This deduplicates pages so our pages rank higher in Google
*/
type Options = ProductViewProps

export const useMetadata = (
  options: Options
): ComponentPropsWithoutRef<typeof GatsbySeo> => {
  const language = useLocale()
  const { pathname, host } = useLocation()
  const {
    site: { siteMetadata },
  }: any = useStaticQuery<ProductPageSeoQueryQuery>(
    graphql`
      query ProductPageSeoQuery {
        site {
          siteMetadata {
            title
            titleTemplate
            description
            author
            siteUrl
          }
        }
      }
    `
  )

  const {
    data: { product },
  } = options

  const title = product?.titleTag || siteMetadata.title
  const description = product?.metaTagDescription || siteMetadata.description
  const canonical = `https://${host}${pathname}`
  const images = useMemo(
    () =>
      product?.items?.[0]?.images?.map((image: any) => ({
        url: image?.imageUrl,
        alt: image?.imageText,
      })),
    [product]
  )

  return {
    ...siteMetadata,
    language,
    title,
    description,
    canonical,
    openGraph: {
      type: 'product',
      url: `${siteMetadata.siteUrl}${pathname}`,
      title,
      description,
      images,
    },
  }
}
