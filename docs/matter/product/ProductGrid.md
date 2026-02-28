# ProductGrid (Matter)

## Intention
Responsive product grid with optimized layout.

## Description
Matter ProductGrid extends foundational ProductGrid with responsive breakpoints optimized for product display.

## Import
```tsx
import ProductGrid from 'src/components/product/ProductGrid'
```

## Extends

[ProductGrid (Foundational)](../../components/organisms/ProductGrid.md) from `@faststore/ui`

## Examples

```tsx
<ProductGrid>
  {products.map((product, i) => (
    <ProductCard key={product.id} product={product} index={i} />
  ))}
</ProductGrid>
```
