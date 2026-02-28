# ProductDetails Section (Matter)

## Intention
Complete product detail page section with all features.

## Description
ProductDetails is comprehensive PDP section integrating product data, images, pricing, variants, quantity, add to cart, shipping simulation, and product information.

## Architecture

```
ProductDetails Section
├── ProductQuery (GraphQL)
├── ImageGallery (with zoom)
├── ProductTitle
├── ProductPrice
├── SkuSelector (variants)
├── QuantitySelector
├── BuyButton (with analytics)
├── ShippingSimulation
├── ProductDescription
└── ViewportObserver
```

## Data Integration

### GraphQL Query
```graphql
query ProductQuery($slug: String!) {
  product(locator: [{key: "slug", value: $slug}]) {
    ...ProductFragment
    isVariantOf {
      skuVariants { ...VariantsFragment }
    }
    additionalProperty { ...AttributesFragment }
  }
}
```

### Analytics Events
- `view_item` on load
- `add_to_cart` on purchase
- `select_item` on variant change

## CMS Configuration

```tsx
export const schema = {
  title: 'Product Details',
  properties: {
    showReviews: { type: 'boolean', default: true },
    showRelated: { type: 'boolean', default: true }
  }
}
```

## Examples

```tsx
<ProductDetails product={productData} />
```
