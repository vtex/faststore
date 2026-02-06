# CartItem

## Intention
Display cart line item with image, details, quantity, price, and remove action.

## Description
CartItem shows a product in the shopping cart with image, title, variant details, quantity selector, price, and remove button. Foundational component for cart displays.

In ecommerce, used in cart sidebar, cart page, and checkout summary.

## Import
```tsx
import { CartItem } from '@faststore/components'
```

## Sub-components
- `CartItemImage` - Product image
- `CartItemSummary` - Details, quantity, price, remove

## Examples

```tsx
<CartItem>
  <CartItemImage>
    <img src={item.image} alt={item.name} />
  </CartItemImage>
  <CartItemSummary
    title={<Link href={item.url}>{item.name}</Link>}
    quantity={item.quantity}
    price={{
      value: item.price * item.quantity,
      formatter: formatPrice
    }}
    onRemove={() => removeItem(item.id)}
    onQuantityChange={(qty) => updateQuantity(item.id, qty)}
  />
</CartItem>
```
