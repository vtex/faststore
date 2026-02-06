# ProductGallery Section (Matter)

## Intention
PLP section with products, filters, and sorting.

## Description
ProductGallery section displays product listing with filtering, sorting, and pagination. Main section for category and search pages.

## Architecture

```
ProductGallery Section
├── useSearchQuery (GraphQL)
├── FilterDesktop/FilterSlider
├── Sort dropdown
├── ProductGrid
│   └── ProductCard (matter)
├── Pagination
└── ViewportObserver
```

## Data Integration

### GraphQL Query
- Product search with facets
- Filter options
- Total count for pagination

## Analytics Events

- `view_item_list` when products visible
- `view_search_results` for search pages

## CMS Configuration

```tsx
export const schema = {
  title: 'Product Gallery',
  properties: {
    itemsPerPage: { type: 'number', default: 12 }
  }
}
```

## Examples

```tsx
<ProductGallery
  term={searchTerm}
  filters={appliedFilters}
/>
```
