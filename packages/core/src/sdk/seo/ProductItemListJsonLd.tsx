import type {
  ServerCollectionPageQueryQuery,
  ServerManyProductsQueryQuery,
} from '@generated/graphql'
import ItemListJsonLd from './ItemListJsonLd'

type ServerDataProps = ServerCollectionPageQueryQuery &
  ServerManyProductsQueryQuery

function ProductItemListJsonLd({
  pathname,
  canonical,
  serverData,
}: { pathname: string; canonical: string; serverData: ServerDataProps }) {
  const products = serverData?.search?.products?.edges ?? []

  if (!products.length) {
    return null
  }

  return (
    <ItemListJsonLd
      id={`${pathname}/#itemList`}
      url={canonical}
      numberOfItems={products.length}
      itemListElements={products.map(({ node: product }) => {
        const { slug, brand, image, isVariantOf, offers, ...rest } = product

        let offer = {}
        if (offers?.offers?.length > 0) {
          const { listPrice, listPriceWithTaxes, quantity, ...offerData } =
            offers.offers[0]
          offer = offerData
        }

        return {
          type: 'Product',
          brand: {
            name: brand?.name,
          },
          image: image?.[0]?.url,
          isVariantOf: {
            name: isVariantOf?.name,
          },
          offers: offer,
          ...rest,
        }
      })}
    />
  )
}

export default ProductItemListJsonLd
