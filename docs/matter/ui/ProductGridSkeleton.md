# ProductGridSkeleton (Matter)

## Intention
Loading placeholder for product grid.

## Description
Grid of ProductCardSkeleton components matching ProductGrid layout.

## Import
```tsx
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
```

## Examples

```tsx
{isLoading ? (
  <ProductGridSkeleton count={8} />
) : (
  <ProductGrid>{products}</ProductGrid>
)}
```
