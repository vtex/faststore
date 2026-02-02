# ProductCard (Matter)

## Intention
Product card with GraphQL data, analytics, and delivery promise.

## Description
Matter ProductCard extends foundational ProductCard with product data fragment, analytics events (view_item), price formatting, delivery promise badges, and optimized images.

## Architecture

```
ProductCard (Matter)
├── GraphQL Product Fragment
├── useFormattedPrice hook
├── useProductLink hook
├── useDeliveryPromise hook
├── sendAnalyticsEvent (view_item)
└── UIProductCard (foundational)
```

## Import
```tsx
import ProductCard from 'src/components/product/ProductCard'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `product` | `ProductSummary` | - | Yes | Product data from GraphQL |
| `index` | `number` | - | Yes | Position in list (for analytics) |
| `bordered` | `boolean` | `false` | No | Show card border |
| `aspectRatio` | `number` | `1` | No | Image aspect ratio |

## Data Integration

### GraphQL Fragment
```graphql
fragment ProductSummary on Product {
  id
  slug
  name
  gtin
  brand { name }
  isVariantOf { productGroupID, name }
  image { url, alternateName }
  offers {
    price
    listPrice
    availability
  }
}
```

### SDK Hooks
- `useFormattedPrice` - Format prices
- `useProductLink` - Generate product URLs
- `useDeliveryPromise` - Delivery badges

## Analytics Events

### view_item
Fired when product card is viewed (intersection observer):
```tsx
{
  name: 'view_item',
  params: {
    items: [{
      item_id: productGroupID,
      item_name: productName,
      item_brand: brandName,
      item_variant: sku,
      price: price,
      discount: listPrice - price,
      index: cardPosition
    }]
  }
}
```

## Extends

[ProductCard (Foundational)](../../components/molecules/ProductCard.md) from `@faststore/ui`

## Examples

```tsx
{products.map((product, index) => (
  <ProductCard
    key={product.id}
    product={product}
    index={index}
    aspectRatio={1}
  />
))}
```
