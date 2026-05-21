# SearchInput (Matter)

## Intention
Search interface with suggestions, history, and Next.js routing.

## Description
Matter SearchInput extends foundational component with search SDK integration, suggestion queries, search history, analytics, and Next.js routing.

## Architecture

```
SearchInput (Matter)
├── useSearch hook (SDK)
├── useSuggestions hook (GraphQL)
├── useSearchHistory hook (SDK)
├── sendAnalyticsEvent (search)
├── Next.js router
└── UISearchInput (foundational)
```

## Import
```tsx
import SearchInput from 'src/components/search/SearchInput'
```

## Data Integration

### GraphQL Queries
- `SearchSuggestionsQuery` - Autocomplete terms
- `SearchTopQuery` - Popular searches

### SDK Hooks
- `useSearch` - Search state
- `useSearchHistory` - Recent searches

## Analytics Events

### search
```tsx
{
  name: 'search',
  params: {
    search_term: query
  }
}
```

## Extends

[SearchInput (Foundational)](../../components/organisms/SearchInput.md)

## Examples

```tsx
<SearchInput placeholder="Search products..." />
```
