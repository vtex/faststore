/**
 * One should use either noindex or canonical, never both

* This deduplicates pages so our pages rank higher in Google
*/
import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import { useCurrency } from '../../sdk/localization/useCurrency'
import { useLocale } from '../../sdk/localization/useLocale'
import type { Product } from './types'

export type Options = {
  product?: Product
  siteMetadata: ComponentPropsWithoutRef<typeof GatsbySeo> & { siteUrl: string }
}

// const {
//   site: { siteMetadata },
// }: any = useStaticQuery<ProductPageSeoQueryQuery>(
//   graphql`
//     query ProductPageSeoQuery {
//       site {
//         siteMetadata {
//           title
//           titleTemplate
//           description
//           author
//           siteUrl
//         }
//       }
//     }
//   `
// )
export const useMetadata = (
  options: Options
): ComponentPropsWithoutRef<typeof GatsbySeo> => {
  const language = useLocale()
  const [currency] = useCurrency()
  const { pathname, host } = useLocation()
  const { product, siteMetadata } = options
  const price = product?.items[0].sellers?.[0].commercialOffer.spotPrice
  const title = product?.titleTag ?? siteMetadata.title
  const description = product?.metaTagDescription ?? siteMetadata.description
  const canonical = `https://${host}${pathname}`
  const images = useMemo(
    () =>
      product?.items[0].images.map((image) => ({
        url: image.imageUrl,
        alt: image.imageText,
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
      type: 'og:product',
      url: `${siteMetadata.siteUrl}${pathname}`,
      title,
      description,
      images,
    },
    metaTags: [
      {
        property: 'product:price:amount',
        content: price,
      },
      {
        property: 'product:price:currency',
        content: currency,
      },
    ],
  }
}
