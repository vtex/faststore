import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import { useMemo } from 'react'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import { scaleImage } from '../../../sdk/img/arquivos/scale'
import { useLocale } from '../../../sdk/localization/useLocale'
import { IMAGE_DEFAULT } from '../../../sdk/product/constants'
import type { ProductPageSeoQueryQuery } from './__generated__/ProductPageSEOQuery.graphql'
import type { ProductViewProps } from '../index'

/**
 * One should use either noindex or canonical, never both

* This deduplicates pages so our pages rank higher in Google
*/
type Options = ProductViewProps

const IMAGE_SIZE = 720

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
    data: {
      vtex: { product },
    },
  } = options

  const title = product?.titleTag || siteMetadata.title
  const description = product?.metaTagDescription || siteMetadata.description
  const canonical = `https://${host}${pathname}`
  const images = useMemo(
    () =>
      product?.items?.[0]?.images?.map((image) => ({
        url: scaleImage(
          image?.imageUrl ?? IMAGE_DEFAULT,
          IMAGE_SIZE,
          IMAGE_SIZE
        ),
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
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
