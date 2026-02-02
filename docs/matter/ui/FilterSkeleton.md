# FilterSkeleton (Matter)

## Intention
Loading placeholder for filter panel.

## Description
Skeleton matching Filter component layout for facet loading states.

## Import
```tsx
import FilterSkeleton from 'src/components/skeletons/FilterSkeleton'
```

## Examples

```tsx
{isLoadingFilters ? (
  <FilterSkeleton />
) : (
  <Filter facets={facets} />
)}
```
