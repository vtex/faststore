# ProductComparison

## Intention
Compare multiple products side-by-side.

## Description
ProductComparison allows users to compare products. Shows comparison table with specs, prices, and features across selected products.

## Import
```tsx
import { ProductComparison } from '@faststore/components'
```

## Sub-components
- `ProductComparisonTrigger` - Open comparison button
- `ProductComparisonToolbar` - Comparison controls
- `ProductComparisonSidebar` - Comparison panel
- `ProductComparisonProvider` - Context provider

## Examples

```tsx
<ProductComparisonProvider>
  <ProductComparisonTrigger />
  <ProductComparisonSidebar products={selectedProducts} />
</ProductComparisonProvider>
```
