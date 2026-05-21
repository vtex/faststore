# ProductCard

## Intention
Display product information in card format for grids and lists.

## Description
ProductCard is the foundational component for displaying products. Provides container with variants (default/wide), border options, and out-of-stock states. Composed with ProductCardImage and ProductCardContent for complete product display.

In ecommerce, the primary component for product grids, search results, recommendations.

## Import
```tsx
import { ProductCard } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-product-card'` | No | ID for testing tools |
| `variant` | `'default' \| 'wide'` | `'default'` | No | Layout variant |
| `bordered` | `boolean` | `false` | No | Show border |
| `outOfStock` | `boolean` | `false` | No | Out of stock state |

## Sub-components
- `ProductCardImage` - Product image container
- `ProductCardContent` - Title, price, actions

## Variants
- **default**: Vertical layout (image top, content bottom)
- **wide**: Horizontal layout (image left, content right on desktop)

## Examples

```tsx
<ProductCard variant="default">
  <ProductCardImage aspectRatio={1}>
    <img src={product.image} alt={product.name} />
  </ProductCardImage>
  <ProductCardContent
    title={product.name}
    price={{
      value: product.price,
      listPrice: product.listPrice,
      formatter: formatPrice
    }}
    linkProps={{ href: `/product/${product.slug}` }}
    onButtonClick={() => addToCart(product)}
  />
</ProductCard>
```
