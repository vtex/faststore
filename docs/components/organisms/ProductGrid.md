# ProductGrid

## Intention
Responsive grid layout for displaying multiple products.

## Description
ProductGrid creates responsive grid layout for product cards. Handles spacing, columns, and responsive breakpoints for optimal product display.

## Import
```tsx
import { ProductGrid } from '@faststore/components'
```

## Sub-components
- `ProductGridItem` - Grid item wrapper

## Examples

```tsx
<ProductGrid>
  {products.map(product => (
    <ProductGridItem key={product.id}>
      <ProductCard {...product} />
    </ProductGridItem>
  ))}
</ProductGrid>
```
