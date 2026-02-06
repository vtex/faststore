# RegionBar

## Intention
Display and select user's region/location.

## Description
RegionBar shows current region and provides ability to change location. Important for region-specific pricing, shipping, and availability.

In ecommerce, ensures users see correct prices and stock for their location.

## Import
```tsx
import { RegionBar } from '@faststore/components'
```

## Examples

```tsx
<RegionBar
  currentRegion="United States"
  onChangeRegion={handleRegionChange}
/>
```
