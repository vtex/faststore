# ProductCardSkeleton (Matter)

## Intention
Loading placeholder for product cards.

## Description
Pre-built skeleton matching ProductCard layout for consistent loading states.

## Import
```tsx
import ProductCardSkeleton from 'src/components/skeletons/ProductCardSkeleton'
```

## Extends

[Skeleton (Foundational)](../../components/atoms/Skeleton.md)

## Examples

```tsx
{isLoading ? (
  <ProductCardSkeleton />
) : (
  <ProductCard product={data} index={0} />
)}
```
