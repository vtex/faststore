/**
 * One should use either noindex or canonical, never both

* This deduplicates pages so our pages rank higher in Google
*/
import { useLocation } from '@reach/router'
import { useMemo } from 'react'
import type { GatsbySeo } from 'gatsby-plugin-next-seo'
import type { ComponentPropsWithoutRef } from 'react'

import { useCurrency } from '../../localization/useCurrency'
import { useLocale } from '../../localization/useLocale'
import type { Product } from './types'

export type Options = {
  product?: Product
  siteMetadata: ComponentPropsWithoutRef<typeof GatsbySeo> & { siteUrl: string }
}

export const useMetadata = (
  options: Options
): ComponentPropsWithoutRef<typeof GatsbySeo> => {
  const language = useLocale()
  const [currency] = useCurrency()
  const { pathname: path, host } = useLocation()
  const { product, siteMetadata } = options
  const price = product?.items[0].sellers?.[0].commercialOffer.spotPrice
  const title = product?.titleTag ?? siteMetadata.title
  const description = product?.metaTagDescription ?? siteMetadata.description
  const pathname = path[path.length - 1] === '/' ? path.slice(0, -1) : path // remove trailing slashes from pathname
  const canonical = host !== undefined ? `https://${host}${pathname}` : pathname
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
