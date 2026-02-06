# ShippingSimulation

## Intention
Calculate shipping costs and delivery time.

## Description
ShippingSimulation allows users to enter postal code and see shipping options with costs and delivery estimates. Essential for informed purchase decisions.

## Import
```tsx
import { ShippingSimulation } from '@faststore/components'
```

## Examples

```tsx
<ShippingSimulation
  productId={product.id}
  onCalculate={(postalCode) => fetchShipping(postalCode)}
  shippingOptions={shippingOptions}
/>
```
