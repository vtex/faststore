# OutOfStock (Matter)

## Intention
Out-of-stock notification with email alerts.

## Description
Matter OutOfStock extends foundational component with email notification integration for stock alerts.

## Import
```tsx
import OutOfStock from 'src/components/product/OutOfStock'
```

## Extends

[OutOfStock (Foundational)](../../components/organisms/OutOfStock.md) from `@faststore/ui`

## Examples

```tsx
<OutOfStock
  productId={product.id}
  onNotifyMe={(email) => subscribeToStockAlert(product.id, email)}
/>
```
