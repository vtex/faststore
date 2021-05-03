import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import { useScaledImage } from '../../../sdk/img/arquivos/useScaledImage'
import { IMAGE_DEFAULT } from '../../../sdk/product/constants'
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
          }
        }
      }
    `
  )

  const {
    data: {
      vtex: { product },
    },
  } = options

  const title = product?.titleTag || siteMetadata.title
  const description = product?.metaTagDescription || siteMetadata.description
  const canonical = `https://${host}${pathname}`
  const image = useScaledImage(
    product?.items?.[0]?.images?.[0]?.imageUrl || IMAGE_DEFAULT,
    50,
    50
  )

  return {
    ...siteMetadata,
    title,
    description,
    canonical,
    openGraph: {
      type: 'product',
      url: canonical,
      title,
      description,
      image,
    },
  }
}
