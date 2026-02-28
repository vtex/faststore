# SKUMatrix

## Intention
Matrix view for selecting multiple SKU variants.

## Description
SKUMatrix displays product variants in matrix format (e.g., size/color grid). Allows selection of multiple variant combinations simultaneously.

## Import
```tsx
import { SKUMatrix } from '@faststore/components'
```

## Sub-components
- `SKUMatrixTrigger` - Open matrix button
- `SKUMatrixSidebar` - Matrix panel
- `SKUMatrixProvider` - Context provider

## Examples

```tsx
<SKUMatrixProvider>
  <SKUMatrixTrigger>View All Options</SKUMatrixTrigger>
  <SKUMatrixSidebar
    variants={productVariants}
    onSelectVariant={handleVariantSelection}
  />
</SKUMatrixProvider>
```
