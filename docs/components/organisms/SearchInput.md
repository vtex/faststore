# SearchInput

## Intention
Main search interface with suggestions and results.

## Description
SearchInput provides complete search experience. Includes input field, suggestions dropdown with autocomplete, history, and product results.

## Import
```tsx
import { SearchInput } from '@faststore/components'
```

## Examples

```tsx
<SearchInput
  placeholder="Search products..."
  onSearch={handleSearch}
>
  <SearchDropdown>
    <SearchHistory terms={recentSearches} />
    <SearchAutoComplete terms={suggestions} />
    <SearchProducts products={quickResults} />
  </SearchDropdown>
</SearchInput>
```
