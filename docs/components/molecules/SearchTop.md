# SearchTop

## Intention
Display top/trending search terms.

## Description
SearchTop shows popular or trending search terms to help users discover products and common queries.

## Import
```tsx
import { SearchTop } from '@faststore/components'
```

## Sub-components
- `SearchTopTerm` - Individual top search

## Examples

```tsx
<SearchTop
  title="Trending Searches"
  terms={['summer dresses', 'running shoes', 'backpacks']}
  onTermClick={(term) => search(term)}
/>
```
