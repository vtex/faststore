# OrderSummary

## Intention
Display order totals including subtotal, shipping, taxes, and total.

## Description
OrderSummary presents a breakdown of cart/order costs. Shows subtotal, discounts, shipping, taxes, and final total in a structured format. Used in cart, checkout, and order confirmation.

## Import
```tsx
import { OrderSummary } from '@faststore/components'
```

## Examples

```tsx
<OrderSummary>
  <div data-order-summary-line>
    <span>Subtotal:</span>
    <Price value={subtotal} formatter={formatPrice} />
  </div>
  <div data-order-summary-line>
    <span>Shipping:</span>
    <Price value={shipping} formatter={formatPrice} />
  </div>
  <div data-order-summary-line>
    <span>Tax:</span>
    <Price value={tax} formatter={formatPrice} />
  </div>
  <div data-order-summary-total>
    <strong>Total:</strong>
    <Price value={total} formatter={formatPrice} />
  </div>
</OrderSummary>
```
