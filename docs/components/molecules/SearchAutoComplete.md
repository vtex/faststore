# SearchAutoComplete

## Intention
Autocomplete search term suggestions.

## Description
SearchAutoComplete displays suggested search terms as user types. Shows popular/relevant completions to help users refine queries.

## Import
```tsx
import { SearchAutoComplete } from '@faststore/components'
```

## Sub-components
- `SearchAutoCompleteTerm` - Individual suggestion

## Examples

```tsx
<SearchAutoComplete
  terms={['wireless headphones', 'wireless keyboard', 'wireless mouse']}
  onTermClick={(term) => search(term)}
/>
```
