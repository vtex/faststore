# ProductComparisonSidebar (Matter UI)

## Intention
Product comparison panel with state management.

## Description
UI wrapper for ProductComparison with comparison state and product data.

## Import
```tsx
import { ProductComparisonSidebar } from 'src/components/ui/ProductComparison'
```

## Data Integration

- Comparison state management
- Product data queries

## Extends

[ProductComparison (Foundational)](../../components/organisms/ProductComparison.md)

## Examples

```tsx
<ProductComparisonSidebar
  products={comparisonProducts}
  onRemove={removeFromComparison}
/>
```
