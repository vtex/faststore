# SearchProducts

## Intention
Display product results in search suggestions.

## Description
SearchProducts shows product matches within search dropdown. Displays quick product results as user types.

## Import
```tsx
import { SearchProducts } from '@faststore/components'
```

## Sub-components
- `SearchProductItem` - Individual product result
- `SearchProductItemImage` - Product image
- `SearchProductItemContent` - Product details
- `SearchProductItemControl` - Actions (add to cart)

## Examples

```tsx
<SearchProducts
  products={searchResults}
  onProductClick={(product) => navigateToProduct(product)}
/>
```
