# CartSidebar (Matter)

## Intention
Sliding cart panel with items, totals, and checkout.

## Description
Matter CartSidebar extends foundational CartSidebar with cart store integration, checkout flow, and empty state handling. Slides in from right with overlay, displays all cart items and totals.

## Architecture

```
CartSidebar (Matter)
├── cartStore (cart items and state)
├── CartItem (matter) - for each item
├── OrderSummary (matter) - totals
├── EmptyCart (matter) - empty state
└── UICartSidebar (foundational)
```

## Import
```tsx
import CartSidebar from 'src/components/cart/CartSidebar'
```

## Data Integration

### SDK Hooks
- **`useCart`**: Cart items and state
- **`useCheckoutButton`**: Checkout navigation

### Cart Store
```tsx
cartStore.items // Array of cart items
cartStore.totalItems // Total quantity
cartStore.subtotal // Cart subtotal
```

## Extends

[CartSidebar (Foundational)](../../components/organisms/CartSidebar.md) from `@faststore/ui`

## Examples

```tsx
<CartSidebar
  isOpen={isCartOpen}
  onClose={() => setCartOpen(false)}
>
  {cartItems.length > 0 ? (
    <>
      <CartSidebarList>
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </CartSidebarList>
      <CartSidebarFooter>
        <OrderSummary />
        <LinkButton href="/checkout">
          Checkout
        </LinkButton>
      </CartSidebarFooter>
    </>
  ) : (
    <EmptyCart />
  )}
</CartSidebar>
```
