# RegionModal

## Intention
Modal for selecting user's region/location.

## Description
RegionModal provides interface for users to select their location. Affects pricing, shipping, and availability. Postal code entry and region selection.

## Import
```tsx
import { RegionModal } from '@faststore/components'
```

## Examples

```tsx
<RegionModal
  isOpen={isRegionModalOpen}
  onClose={() => setRegionModalOpen(false)}
  onSubmit={handleRegionSelection}
/>
```
