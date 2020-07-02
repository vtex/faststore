import { Item, Product as VTEXProduct } from '@vtex/gatsby-source-vtex'

import { MetaTag, setMetaTag } from './tagManager'

export interface SiteMetadata {
  name?: string
  title?: string
}

export interface Options {
  product: VTEXProduct
  siteMetadata: SiteMetadata
}

const LIMIT_IMAGES = 3

const getImageTags = (sku?: Item) => {
  if (!sku) {
    return null
  }

  return sku.images.reduce((acc, { imageUrl }) => {
    if (!imageUrl || acc.length === LIMIT_IMAGES) {
      return acc
    }
    acc.push({ property: 'og:image', content: imageUrl })
    return acc
  }, [] as MetaTag[])
}

const getAvailabilityTag = (sku?: Item) => {
  if (!sku) {
    return null
  }

  const seller = sku.sellers.find(
    ({ commertialOffer }) => commertialOffer.AvailableQuantity > 0
  )

  const availability = seller ? 'instock' : 'oos'

  return { property: 'product:availability', content: `${availability}` }
}

const getPriceTag = (sku?: Item) => {
  if (!sku) {
    return null
  }

  const seller = sku.sellers.find(
    ({ commertialOffer }) => commertialOffer.AvailableQuantity > 0
  )

  if (!seller) {
    return null
  }

  return {
    property: 'product:price:amount',
    content: `${seller.commertialOffer.Price}`,
  }
}

export const inject = ({ product, siteMetadata: { name, title } }: Options) => {
  const { hostname, pathname } = window.location
  const { productTitle, productName, items } = product
  const [sku] = items

  const suffix = (title || name) && ` - ${title ?? name}`

  let titleTag = productTitle || productName
  if (suffix) {
    titleTag += suffix
  }

  const metaTags = [
    { property: 'og:type', content: 'product' },
    { property: 'og:title', content: titleTag },
    { property: 'og:url', content: `https://${hostname}${pathname}` },
    { property: 'og:description', content: product.metaTagDescription },
    sku ? { property: 'product:sku', content: sku.itemId } : null,
    { property: 'product:condition', content: 'new' },
    { property: 'product:brand', content: product.brand },
    { property: 'product:retailer_item_id', content: product.productReference },
    { property: 'product:price:currency', content: `TODO` },
    ...(getImageTags(sku) ?? []),
    getAvailabilityTag(sku),
    getPriceTag(sku),
  ]

  for (const tag of metaTags) {
    if (!tag) {
      continue
    }
    setMetaTag(tag)
  }
}
