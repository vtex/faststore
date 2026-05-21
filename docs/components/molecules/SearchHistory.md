# SearchHistory

## Intention
Display user's recent searches.

## Description
SearchHistory shows user's previous search terms for quick re-search. Helps users return to recent queries.

## Import
```tsx
import { SearchHistory } from '@faststore/components'
```

## Sub-components
- `SearchHistoryTerm` - Individual history item

## Examples

```tsx
<SearchHistory
  terms={recentSearches}
  onTermClick={(term) => search(term)}
  onClearHistory={clearSearchHistory}
/>
```
