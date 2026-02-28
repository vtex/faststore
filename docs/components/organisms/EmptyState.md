# EmptyState

## Intention
Display message when no content/results available.

## Description
EmptyState shows helpful message and actions when lists are empty. Used for empty carts, no search results, empty wishlists.

## Import
```tsx
import { EmptyState } from '@faststore/components'
```

## Examples

```tsx
<EmptyState
  title="Your cart is empty"
  description="Start adding items to your cart"
  action={
    <LinkButton href="/products">
      Continue Shopping
    </LinkButton>
  }
  illustration={<img src="/empty-cart.svg" alt="" />}
/>
```
