# Sort (Matter)

## Intention
Sort dropdown with URL state synchronization.

## Description
Sort dropdown for product sorting with URL param integration.

## Import
```tsx
import Sort from 'src/components/search/Sort'
```

## Data Integration

- URL search params for sort state

## Examples

```tsx
<Sort
  options={{
    'relevance': 'Most Relevant',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low'
  }}
/>
```
