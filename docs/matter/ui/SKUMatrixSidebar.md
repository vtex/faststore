# SKUMatrixSidebar (Matter UI)

## Intention
SKU matrix panel with state management.

## Description
UI wrapper for SKUMatrix with matrix state and selection handling.

## Import
```tsx
import { SKUMatrixSidebar } from 'src/components/ui/SKUMatrix'
```

## Extends

[SKUMatrix (Foundational)](../../components/organisms/SKUMatrix.md)

## Examples

```tsx
<SKUMatrixSidebar
  variants={product.skuVariants}
  onSelect={handleMatrixSelection}
/>
```
