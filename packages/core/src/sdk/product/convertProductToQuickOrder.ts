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

  // Determine availability based on the offer's availability field
  // Availability can be 'https://schema.org/InStock' or 'https://schema.org/OutOfStock'
  const isOutOfStock = offer.availability === 'https://schema.org/OutOfStock'
  const isInStock = offer.availability === 'https://schema.org/InStock'

  // Get inventory quantity from the offer
  // If quantity is not provided, we'll use a default high value when InStock
  // This handles cases where the API doesn't return quantity but marks it as InStock
  const offerQuantity = (offer as { quantity?: number | null }).quantity
  const inventory =
    offerQuantity != null
      ? offerQuantity
      : isInStock
        ? 999999 // Default to high inventory when InStock but quantity not provided
        : 0

  // Product is available if it's in stock
  // If quantity is provided, we also check it, but availability field takes precedence
  const availability = isInStock ? 'available' : 'outOfStock'

  // Determine selectedCount and quantityUpdated based on availability and inventory
  let selectedCount: number
  let quantityUpdated: boolean

  if (isOutOfStock) {
    // Out of stock: set quantity to 0
    selectedCount = 0
    quantityUpdated = true
  } else if (inventory === 0) {
    // Inventory is 0 but marked as InStock (edge case): set quantity to 0
    selectedCount = 0
    quantityUpdated = true
  } else if (offerQuantity != null && requestedQuantity > inventory) {
    // Quantity is provided and requested quantity exceeds inventory: cap at inventory
    selectedCount = inventory
    quantityUpdated = true
  } else {
    // Requested quantity is within inventory (or quantity not provided): use requested quantity
    selectedCount = requestedQuantity
    quantityUpdated = false
  }

  // Get the variant name from allVariantProducts that matches this product's SKU
  // This ensures we use the correct variant name instead of the product name
  const variantProduct =
    product.isVariantOf?.skuVariants?.allVariantProducts?.find(
      (variant) =>
        variant.productID === product.id || variant.productID === product.sku
    )
  const productName = variantProduct?.name ?? product.name

  return {
    id: product.sku,
    name: productName,
    price: offer.price,
    quantityUpdated,
    image: {
      url: product.image[0]?.url || '',
      alternateName: product.image[0]?.alternateName || product.name,
    },
    inventory,
    availability: availability as 'available' | 'outOfStock',
    selectedCount,
  }
}
