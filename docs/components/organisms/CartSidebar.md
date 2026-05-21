# CartSidebar

## Intention
Slide-out shopping cart panel.

## Description
CartSidebar displays cart contents in sliding sidebar. Shows cart items, totals, and checkout button. Slides in from right side of screen.

## Import
```tsx
import { CartSidebar } from '@faststore/components'
```

## Sub-components
- `CartSidebarList` - Cart items list
- `CartSidebarFooter` - Total and checkout

## Examples

```tsx
<CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)}>
  <CartSidebarList>
    {cartItems.map(item => (
      <CartItem key={item.id} {...item} />
    ))}
  </CartSidebarList>
  <CartSidebarFooter>
    <OrderSummary total={cartTotal} />
    <LinkButton href="/checkout">
      Proceed to Checkout
    </LinkButton>
  </CartSidebarFooter>
</CartSidebar>
```
