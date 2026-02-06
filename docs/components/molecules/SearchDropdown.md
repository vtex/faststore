# SearchDropdown

## Intention
Dropdown container for search suggestions and results.

## Description
SearchDropdown provides dropdown overlay that appears when search is focused. Contains search history, autocomplete, and product results.

## Import
```tsx
import { SearchDropdown } from '@faststore/components'
```

## Examples

```tsx
<SearchDropdown isOpen={isSearchFocused}>
  <SearchHistory terms={recentSearches} />
  <SearchAutoComplete terms={suggestions} />
  <SearchProducts products={topResults} />
  <SearchTop terms={trending} />
</SearchDropdown>
```
