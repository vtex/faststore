# ProductShelf Section (Matter)

## Intention
CMS-configurable product carousel section.

## Description
ProductShelf section with GraphQL product query, analytics, and CMS configuration. Displays product recommendations or curated collections.

## Import
```tsx
import ProductShelf from 'src/components/sections/ProductShelf'
```

## Architecture

```
ProductShelf Section
├── useProductsQuery (GraphQL)
├── ViewportObserver (lazy loading)
├── sendAnalyticsEvent (view_item_list)
└── UIProductShelf
    └── ProductCard (matter)
```

## Data Integration

### GraphQL Query
```graphql
query ProductShelfQuery($first: Int!, $collection: String) {
  search(first: $first, selectedFacets: [{key: "collection", value: $collection}]) {
    products {
      edges {
        node { ...ProductSummary }
      }
    }
  }
}
```

## Analytics Events

### view_item_list
```tsx
{
  name: 'view_item_list',
  params: {
    item_list_id: shelfId,
    item_list_name: shelfTitle,
    items: products.map((p, i) => ({ ...p, index: i }))
  }
}
```

## CMS Configuration

```tsx
export const schema = {
  title: 'Product Shelf',
  type: 'object',
  properties: {
    title: { type: 'string' },
    collection: { type: 'string' },
    numberOfProducts: { type: 'number', default: 5 }
  }
}
```

## Extends

[ProductShelf (Foundational)](../../components/organisms/ProductShelf.md)

## Examples

```tsx
<ProductShelf
  title="Recommended for You"
  collection="recommendations"
  numberOfProducts={8}
/>
```
