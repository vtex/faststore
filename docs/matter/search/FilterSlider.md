# FilterSlider (Matter)

## Intention
Mobile filter panel in slide-out drawer.

## Description
FilterSlider provides mobile filtering with slide-out panel and filter state.

## Import
```tsx
import { FilterSlider } from 'src/components/search/Filter'
```

## Examples

```tsx
<FilterSlider
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  facets={searchFacets}
/>
```
