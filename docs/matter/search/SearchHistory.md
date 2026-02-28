# SearchHistory (Matter)

## Intention
Display recent searches from user history.

## Description
Matter SearchHistory extends foundational component with search SDK history integration.

## Import
```tsx
import SearchHistory from 'src/components/search/SearchHistory'
```

## Data Integration

- `useSearchHistory` SDK hook

## Extends

[SearchHistory (Foundational)](../../components/molecules/SearchHistory.md)

## Examples

```tsx
<SearchHistory onTermClick={(term) => search(term)} />
```
