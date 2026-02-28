# EmptyCart (Matter)

## Intention
Empty cart state with call-to-action.

## Description
Matter EmptyCart displays when cart has no items. Shows message and CTA to continue shopping. Extends foundational EmptyState component.

## Architecture

```
EmptyCart (Matter)
└── EmptyState (foundational)
```

## Import
```tsx
import EmptyCart from 'src/components/cart/EmptyCart'
```

## Extends

[EmptyState (Foundational)](../../components/organisms/EmptyState.md) from `@faststore/ui`

## Examples

```tsx
{cartItems.length === 0 && (
  <EmptyCart
    title="Your cart is empty"
    description="Start adding items to your cart"
    action={
      <LinkButton href="/products">
        Continue Shopping
      </LinkButton>
    }
  />
)}
```
