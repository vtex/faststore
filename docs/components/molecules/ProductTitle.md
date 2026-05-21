# ProductTitle

## Intention
Display product name with optional label, rating, and reference number.

## Description
ProductTitle combines product title, badges/labels, ratings, and reference numbers in a structured header. Used primarily on product detail pages for comprehensive product identification.

## Import
```tsx
import { ProductTitle } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-product-title'` | No | ID for testing tools |
| `title` | `ReactNode` | - | Yes | Product title (typically h1) |
| `label` | `ReactNode` | - | No | Badge/label (e.g., DiscountBadge) |
| `refTag` | `string` | `'Ref.: '` | No | Reference label text |
| `refNumber` | `string` | - | No | SKU or reference number |
| `ratingValue` | `number` | - | No | Product rating (0-5) |

## Examples

```tsx
<ProductTitle
  title={<h1>{product.name}</h1>}
  label={<DiscountBadge listPrice={100} spotPrice={80} />}
  ratingValue={4.5}
  refNumber="SKU-12345"
/>
```
