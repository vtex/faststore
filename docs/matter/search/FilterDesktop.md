# FilterDesktop (Matter)

## Intention
Desktop filter panel with facet state management.

## Description
FilterDesktop provides desktop filtering UI with URL-synced filter state.

## Import
```tsx
import { FilterDesktop } from 'src/components/search/Filter'
```

## Data Integration

- URL search params for filter state
- Filter facets from search results

## Examples

```tsx
<FilterDesktop
  facets={searchFacets}
  onFilterChange={handleFilterChange}
/>
```
