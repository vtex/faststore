# SearchProvider

## Intention
Context provider for search state and functionality.

## Description
SearchProvider manages search state including query, suggestions, history. Provides context for search components to share state.

## Import
```tsx
import { SearchProvider } from '@faststore/components'
```

## Examples

```tsx
<SearchProvider>
  <SearchInput />
  <SearchDropdown>
    <SearchHistory />
    <SearchAutoComplete />
    <SearchProducts />
  </SearchDropdown>
</SearchProvider>
```
