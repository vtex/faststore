# NotAvailableButton (Matter)

## Intention
Button for products that are out of stock or unavailable.

## Description
NotAvailableButton displays disabled button state for unavailable products. Provides consistent UX for out-of-stock items.

## Import
```tsx
import NotAvailableButton from 'src/components/product/NotAvailableButton'
```

## Examples

```tsx
{product.inStock ? (
  <BuyButton onClick={() => addToCart(product)}>
    Add to Cart
  </BuyButton>
) : (
  <NotAvailableButton>
    Out of Stock
  </NotAvailableButton>
)}
```
