# PriceRange

## Intention
Price filter with dual-range slider and inputs.

## Description
PriceRange combines Slider with min/max inputs for price filtering. Provides both slider interaction and direct numeric entry.

## Import
```tsx
import { PriceRange } from '@faststore/components'
```

## Examples

```tsx
<PriceRange
  min={{ absolute: 0, selected: priceRange.min }}
  max={{ absolute: 1000, selected: priceRange.max }}
  formatter={formatPrice}
  onSubmit={(range) => applyPriceFilter(range)}
/>
```
