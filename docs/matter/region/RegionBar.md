# RegionBar (Matter)

## Intention
Display and change user's region with session integration.

## Description
Matter RegionBar extends foundational component with session store for region persistence and modal integration.

## Import
```tsx
import RegionBar from 'src/components/region/RegionBar'
```

## Data Integration

### SDK Hooks
- `useSession` - Current region data
- Session store region persistence

## Extends

[RegionBar (Foundational)](../../components/molecules/RegionBar.md)

## Examples

```tsx
<RegionBar onClick={() => setRegionModalOpen(true)} />
```
