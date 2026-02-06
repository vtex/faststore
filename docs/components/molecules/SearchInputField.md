# SearchInputField

## Intention
Search input with integrated search icon.

## Description
SearchInputField combines Input with search icon for search functionality. Provides standard search field appearance and behavior.

## Import
```tsx
import { SearchInputField } from '@faststore/components'
```

## Examples

```tsx
<SearchInputField
  placeholder="Search products..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onSubmit={handleSearch}
/>
```
