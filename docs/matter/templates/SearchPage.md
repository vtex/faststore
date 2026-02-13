# SearchPage (Matter)

## Intention
Search results page template.

## Description
SearchPage template for displaying search results with filters, sort, and empty state handling.

## Import
```tsx
import SearchPage from 'src/components/templates/SearchPage'
```

## Architecture

```
SearchPage
├── useSearchQuery (GraphQL)
├── Filter components
├── Sort dropdown
├── SearchProductGrid
├── EmptySearch (no results)
└── SEO metadata
```

## Analytics Events

- `search` event on query execution
- `view_search_results` event

## Examples

```tsx
<SearchPage searchTerm={query} />
```
