# RegionModal (Matter)

## Intention
Modal for selecting user location with validation.

## Description
Matter RegionModal handles postal code validation, region selection, and session updates.

## Import
```tsx
import RegionModal from 'src/components/region/RegionModal'
```

## Data Integration

### SDK Hooks
- `useSession` - Save region to session
- Postal code validation API

## Extends

[RegionModal (Foundational)](../../components/organisms/RegionModal.md)

## Examples

```tsx
<RegionModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```
