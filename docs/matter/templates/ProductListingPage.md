# ProductListingPage (Matter)

## Intention
Category/collection page template with products and filters.

## Description
ProductListingPage template for category pages. Includes product grid, filters, sorting, pagination, and SEO.

## Import
```tsx
import ProductListingPage from 'src/components/templates/ProductListingPage'
```

## Architecture

```
ProductListingPage
├── useProductsQuery (GraphQL)
├── Filter components
├── Sort dropdown
├── ProductGrid
├── Pagination
└── SEO metadata
```

## Data Integration

### GraphQL Query
```graphql
query ProductsQuery($first: Int!, $after: String, $sort: String, $term: String) {
  search(first: $first, after: $after, sort: $sort, term: $term) {
    products { edges { node { ...ProductSummary } } }
    facets { ...Facets }
  }
}
```

## Examples

```tsx
<ProductListingPage
  collection="electronics"
  title="Electronics"
/>
```
