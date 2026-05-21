# ProductShelfSkeleton (Matter)

## Intention
Loading placeholder for product shelf carousel.

## Description
Horizontal row of ProductCardSkeleton matching ProductShelf layout.

## Import
```tsx
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
```

## Examples

```tsx
{isLoading ? (
  <ProductShelfSkeleton />
) : (
  <ProductShelf products={products} />
)}
```
