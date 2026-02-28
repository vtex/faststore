# ProductTilesSkeleton (Matter)

## Intention
Loading placeholder for product tiles layout.

## Description
Grid of tile skeletons matching ProductTiles layout.

## Import
```tsx
import ProductTilesSkeleton from 'src/components/skeletons/ProductTilesSkeleton'
```

## Examples

```tsx
{isLoading ? (
  <ProductTilesSkeleton count={4} />
) : (
  <ProductTiles products={products} />
)}
```
