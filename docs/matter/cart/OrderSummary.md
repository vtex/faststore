# OrderSummary (Matter)

## Intention
Cart/order totals with subtotal, shipping, taxes, discounts.

## Description
Matter OrderSummary displays order cost breakdown from cart store. Shows subtotal, applied discounts, shipping, taxes, and total. Automatically formatted with current currency.

## Architecture

```
OrderSummary (Matter)
├── cartStore (totals data)
├── useFormattedPrice (formatting)
├── useSession (currency, taxes config)
└── UIOrderSummary (foundational)
```

## Import
```tsx
import OrderSummary from 'src/components/cart/OrderSummary'
```

## Data Integration

### Cart Store
```tsx
cartStore.subtotal // Items subtotal
cartStore.discount // Applied discounts
cartStore.shipping // Shipping cost
cartStore.tax // Tax amount
cartStore.total // Final total
```

### Hooks
- `useFormattedPrice` - Currency formatting
- `useSession` - Taxes configuration

## Extends

[OrderSummary (Foundational)](../../components/molecules/OrderSummary.md) from `@faststore/ui`

## Examples

```tsx
<OrderSummary />

// Automatically displays:
// Subtotal: $99.99
// Discount: -$10.00
// Shipping: $5.99
// Tax: $8.50
// Total: $104.48
```
