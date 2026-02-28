# SkuSelector

## Intention
Select product variants like size, color, material.

## Description
SkuSelector allows selection of product SKU variants. Displays available options (size, color, etc.) and handles variant selection.

In ecommerce, essential for products with multiple variants.

## Import
```tsx
import { SkuSelector } from '@faststore/components'
```

## Examples

```tsx
<div>
  <SkuSelector
    variant="Size"
    options={['S', 'M', 'L', 'XL']}
    selected="M"
    onChange={(size) => selectVariant('size', size)}
  />
  
  <SkuSelector
    variant="Color"
    options={['Black', 'White', 'Blue']}
    selected="Black"
    onChange={(color) => selectVariant('color', color)}
  />
</div>
```
