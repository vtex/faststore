# Breadcrumb

## Intention
Navigation trail showing current page hierarchy.

## Description
Breadcrumb displays the navigation path from home to current page. Helps users understand location and navigate back through hierarchy. Uses semantic markup for accessibility.

In ecommerce, shows navigation from home through categories to product.

## Import
```tsx
import { Breadcrumb } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `breadcrumbList` | `Array<{item: string, name: string, position: number}>` | - | Yes | Breadcrumb items |

## Accessibility

- Uses `<nav>` with `aria-label="Breadcrumb"`
- Current page marked with `aria-current="page"`
- Proper list semantics

## Examples

```tsx
<Breadcrumb
  breadcrumbList={[
    { item: '/', name: 'Home', position: 1 },
    { item: '/electronics', name: 'Electronics', position: 2 },
    { item: '/electronics/phones', name: 'Phones', position: 3 },
  ]}
/>
// Renders: Home / Electronics / Phones
```
