# PickupPointCards (Matter UI)

## Intention
Display available pickup locations.

## Description
Displays pickup point options with addresses, hours, and selection.

## Import
```tsx
import { PickupPointCards } from 'src/components/ui/PickupPoints'
```

## Sub-components
- `PickupPointCard` - Individual pickup location

## Examples

```tsx
<PickupPointCards
  pickupPoints={locations}
  selectedId={selectedPickup}
  onSelect={setSelectedPickup}
/>
```
