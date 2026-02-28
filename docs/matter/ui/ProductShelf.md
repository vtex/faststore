# ProductShelf (Matter UI)

## Intention
Product carousel with data fetching hooks.

## Description
UI wrapper for ProductShelf with product query hooks and analytics.

## Import
```tsx
import { ProductShelf } from 'src/components/ui/ProductShelf'
```

## Data Integration

- `useProductsQuery` hook
- Analytics integration

## Extends

[ProductShelf (Foundational)](../../components/organisms/ProductShelf.md)

## Examples

```tsx
<ProductShelf
  title="You May Also Like"
  collection="recommendations"
/>
```
