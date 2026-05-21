# SkuSelector (Matter UI)

## Intention
Variant selector with product data integration.

## Description
UI wrapper for SkuSelector with product variant data and selection handling.

## Import
```tsx
import { SkuSelector } from 'src/components/ui/SkuSelector'
```

## Extends

[SkuSelector (Foundational)](../../components/molecules/SkuSelector.md)

## Examples

```tsx
<SkuSelector
  variants={product.variants}
  selectedSku={selectedSku}
  onSelectSku={handleSkuChange}
/>
```
