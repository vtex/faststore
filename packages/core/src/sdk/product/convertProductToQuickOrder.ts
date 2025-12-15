import type { Product } from '@faststore/ui'
import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

/**
 * Converts a product from the API to the format expected by QuickOrderDrawer
 */
export const convertProductToQuickOrder = (
  product: ProductDetailsFragment_ProductFragment,
  requestedQuantity: number
): Product | null => {
  if (!product || !product.offers || !product.offers.offers.length) {
    return null
  }

  const offer = product.offers.offers[0]
  const availability =
    offer.availability === 'https://schema.org/OutOfStock' ||
    (offer.availability === 'https://schema.org/InStock') === false
      ? 'outOfStock'
      : 'available'

  // For now, we'll use a default inventory value
  // This should be replaced with actual inventory data when available in the API
  const inventory = offer.quantity ?? 999 // Default to a high number if not available

  // Check if the requested quantity exceeds inventory
  const quantityUpdated = requestedQuantity > inventory

  return {
    id: product.sku,
    name: product.name,
    price: offer.price,
    quantityUpdated,
    image: {
      url: product.image[0]?.url || '',
      alternateName: product.image[0]?.alternateName || product.name,
    },
    inventory,
    availability: availability as 'available' | 'outOfStock',
    selectedCount: quantityUpdated ? inventory : requestedQuantity,
  }
}
