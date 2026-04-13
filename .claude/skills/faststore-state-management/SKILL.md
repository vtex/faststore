---
name: faststore-state-management
description: "Apply when deciding, designing, or implementing client-side state with FastStore SDK hooks like useCart, useSession, or useSearch. Covers cart manipulation, session handling, faceted search, and analytics event tracking from @faststore/sdk. Use for any interactive ecommerce feature that relies on FastStore's built-in state management."
---

# FastStore SDK State Management

## When this skill applies

Use this skill when:
- You are building any interactive ecommerce feature that involves the shopping cart, user session, product search/filtering, or analytics tracking.
- You need to add, remove, or update cart items.
- You need to read or change session data (currency, locale, sales channel, postal code).
- You need to manage faceted search state (sort order, selected facets, pagination).
- You are working with `@faststore/sdk` hooks (`useCart`, `useSession`, `useSearch`).

Do not use this skill for:
- Visual-only changes — use the `faststore-theming` skill.
- Replacing or customizing native components — use the `faststore-overrides` skill.
- Extending the GraphQL schema or fetching custom data — use the `faststore-data-fetching` skill.

## Decision rules

- Use `useCart()` for all cart operations — it handles platform validation, price verification, and analytics automatically.
- Use `useSession()` for all session data — it triggers `validateSession` mutations that keep the platform synchronized.
- Use `useSearch()` within `SearchProvider` for all search state — it synchronizes with URL parameters and supports browser back-button navigation.
- Do not build custom state management (React Context, Redux, Zustand, `useState`/`useReducer`) for cart, session, or search. The SDK hooks are wired into the FastStore platform integration layer.
- Always check `isValidating` from `useCart()` and block checkout navigation during validation.
- Use `sendAnalyticsEvent()` from the SDK for GA4-compatible ecommerce event tracking.

## Hard constraints

### Constraint: Use @faststore/sdk for Cart, Session, and Search State

MUST use `@faststore/sdk` hooks (`useCart`, `useSession`, `useSearch`) for managing cart, session, and search state. MUST NOT build custom state management (React Context, Redux, Zustand, useState/useReducer) for these domains.

**Why this matters**
The SDK hooks are wired into the FastStore platform integration layer. `useCart()` triggers cart validation mutations. `useSession()` propagates locale/currency changes to all data queries. `useSearch()` synchronizes with URL parameters and triggers search re-fetches. Custom state bypasses all of this — carts won't be validated, prices may be stale, search won't sync with URLs, and analytics events won't fire.

**Detection**
If you see `useState` or `useReducer` managing cart items, cart totals, session locale, session currency, or search facets → STOP. These should use `useCart()`, `useSession()`, or `useSearch()` from `@faststore/sdk`. If you see `createContext` with names like `CartContext`, `SessionContext`, or `SearchContext` → STOP. The SDK already provides these contexts.

**Correct**
```typescript
// src/components/MiniCart.tsx
import React from 'react'
import { useCart } from '@faststore/sdk'

export default function MiniCart() {
  const { items, totalItems, isValidating, removeItem } = useCart()

  if (totalItems === 0) {
    return <p>Your cart is empty</p>
  }

  return (
    <div data-fs-mini-cart>
      <h3>Cart ({totalItems} items)</h3>
      {isValidating && <span>Updating cart...</span>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.itemOffered.name}</span>
            <span>${item.price}</span>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Wrong**
```typescript
// WRONG: Building a custom cart context instead of using @faststore/sdk
import React, { createContext, useContext, useReducer } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

// This custom context duplicates what @faststore/sdk already provides.
// Cart changes here will NOT trigger platform validation.
// Prices and availability will NOT be verified against VTEX.
// Analytics events will NOT fire for add-to-cart actions.
const CartContext = createContext<{
  items: CartItem[]
  dispatch: React.Dispatch<any>
}>({ items: [], dispatch: () => {} })

function cartReducer(state: CartItem[], action: any) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload]
    case 'REMOVE':
      return state.filter((item) => item.id !== action.payload)
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  return (
    <CartContext.Provider value={{ items, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}
```

---

### Constraint: Always Handle Cart Validation State

MUST check the `isValidating` flag from `useCart()` and show appropriate loading states during cart validation. MUST NOT allow checkout navigation while `isValidating` is `true`.

**Why this matters**
Cart validation is an asynchronous operation that checks items against the VTEX platform for current prices, availability, and applicable promotions. If a user proceeds to checkout during validation, they may see stale prices or encounter errors. The `isValidating` flag exists to prevent this.

**Detection**
If you see `useCart()` destructured without `isValidating` in components that have checkout links or "Proceed to Checkout" buttons → warn that the validation state is not being handled. If you see a checkout link or button that does not check `isValidating` before navigating → warn about potential stale cart data.

**Correct**
```typescript
// src/components/CartSummary.tsx
import React from 'react'
import { useCart } from '@faststore/sdk'

export default function CartSummary() {
  const { items, totalItems, isValidating } = useCart()

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div data-fs-cart-summary>
      <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      {isValidating && (
        <p data-fs-cart-validating>Verifying prices and availability...</p>
      )}
      <a
        href="/checkout"
        data-fs-checkout-button
        aria-disabled={isValidating}
        onClick={(e) => {
          if (isValidating) {
            e.preventDefault()
          }
        }}
      >
        {isValidating ? 'Updating cart...' : 'Proceed to Checkout'}
      </a>
    </div>
  )
}
```

**Wrong**
```typescript
// WRONG: Ignoring cart validation state
import React from 'react'
import { useCart } from '@faststore/sdk'

export default function CartSummary() {
  const { items, totalItems } = useCart()
  // Missing isValidating — user can click checkout while cart is being validated.
  // This can lead to price mismatches at checkout or failed orders.

  return (
    <div>
      <p>{totalItems} items</p>
      <a href="/checkout">Proceed to Checkout</a>
      {/* No loading state. No validation check. User may proceed with stale prices. */}
    </div>
  )
}
```

---

### Constraint: Do Not Store Session Data in localStorage

MUST use `useSession()` from `@faststore/sdk` for accessing session data (currency, locale, channel, person). MUST NOT read/write session data directly to `localStorage` or `sessionStorage`.

**Why this matters**
The SDK's session module manages synchronization with the VTEX platform. When session data changes, the SDK triggers a `validateSession` mutation that updates the server-side session and re-validates the cart. Writing directly to `localStorage` bypasses this validation — the platform won't know about the change, prices may display in the wrong currency, and cart items may not reflect the correct sales channel.

**Detection**
If you see `localStorage.getItem` or `localStorage.setItem` with keys related to session data (currency, locale, channel, region, postalCode) → STOP. These should be managed through `useSession()`. If you see `sessionStorage` used for the same purpose → STOP.

**Correct**
```typescript
// src/components/LocaleSwitcher.tsx
import React from 'react'
import { useSession } from '@faststore/sdk'

export default function LocaleSwitcher() {
  const { locale, currency, setSession } = useSession()

  const handleLocaleChange = (newLocale: string, newCurrency: string) => {
    // setSession triggers platform validation and re-fetches data
    setSession({
      locale: newLocale,
      currency: { code: newCurrency, symbol: newCurrency === 'USD' ? '$' : 'R$' },
    })
  }

  return (
    <div data-fs-locale-switcher>
      <button
        onClick={() => handleLocaleChange('en-US', 'USD')}
        aria-pressed={locale === 'en-US'}
      >
        EN
      </button>
      <button
        onClick={() => handleLocaleChange('pt-BR', 'BRL')}
        aria-pressed={locale === 'pt-BR'}
      >
        PT
      </button>
      <span>Current: {locale} ({currency.code})</span>
    </div>
  )
}
```

**Wrong**
```typescript
// WRONG: Managing session data manually via localStorage
import React, { useState, useEffect } from 'react'

export default function LocaleSwitcher() {
  const [locale, setLocale] = useState('en-US')

  useEffect(() => {
    // WRONG: Reading session data from localStorage
    const saved = localStorage.getItem('store-locale')
    if (saved) setLocale(saved)
  }, [])

  const handleLocaleChange = (newLocale: string) => {
    // WRONG: Writing session data to localStorage
    // The VTEX platform does NOT know about this change.
    // Product prices, availability, and cart will NOT update.
    localStorage.setItem('store-locale', newLocale)
    setLocale(newLocale)
  }

  return (
    <div>
      <button onClick={() => handleLocaleChange('en-US')}>EN</button>
      <button onClick={() => handleLocaleChange('pt-BR')}>PT</button>
    </div>
  )
}
```

## Preferred pattern

Recommended usage of SDK hooks together:

```typescript
// src/components/CartDrawer.tsx
import React from 'react'
import { useCart } from '@faststore/sdk'
import { useSession } from '@faststore/sdk'
import { Button, Loader } from '@faststore/ui'

export default function CartDrawer() {
  const { items, totalItems, isValidating, removeItem, updateItemQuantity } =
    useCart()
  const { currency, locale } = useSession()

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.code,
  })

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (totalItems === 0) {
    return (
      <div data-fs-cart-drawer>
        <h2>Your Cart</h2>
        <p>Your cart is empty. Start shopping to add items.</p>
      </div>
    )
  }

  return (
    <div data-fs-cart-drawer>
      <h2>Your Cart ({totalItems} items)</h2>

      {isValidating && (
        <div data-fs-cart-loading>
          <Loader />
          <span>Verifying prices and availability...</span>
        </div>
      )}

      <ul data-fs-cart-items>
        {items.map((item) => (
          <li key={item.id} data-fs-cart-item>
            <span data-fs-cart-item-name>{item.itemOffered.name}</span>
            <span data-fs-cart-item-price>{formatter.format(item.price)}</span>
            <div data-fs-cart-item-quantity>
              <Button
                variant="tertiary"
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </Button>
              <span>{item.quantity}</span>
              <Button
                variant="tertiary"
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button variant="tertiary" onClick={() => removeItem(item.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>

      <div data-fs-cart-summary>
        <span>Subtotal: {formatter.format(subtotal)}</span>
        <a
          href="/checkout"
          data-fs-checkout-button
          aria-disabled={isValidating}
          onClick={(e) => {
            if (isValidating) e.preventDefault()
          }}
        >
          {isValidating ? 'Updating cart...' : 'Proceed to Checkout'}
        </a>
      </div>
    </div>
  )
}
```

Search state with `useSearch()`:

```typescript
// src/components/FacetFilter.tsx
import { useSearch } from '@faststore/sdk'

export default function FacetFilter() {
  const { state, setState } = useSearch()

  const toggleFacet = (facetKey: string, facetValue: string) => {
    const currentFacets = state.selectedFacets || []
    const exists = currentFacets.some(
      (f) => f.key === facetKey && f.value === facetValue
    )

    const newFacets = exists
      ? currentFacets.filter(
          (f) => !(f.key === facetKey && f.value === facetValue)
        )
      : [...currentFacets, { key: facetKey, value: facetValue }]

    setState({
      ...state,
      selectedFacets: newFacets,
      page: 0, // Reset pagination when filters change
    })
  }

  return (
    <div data-fs-facet-filter>
      <button onClick={() => toggleFacet('brand', 'Nike')}>
        Nike {state.selectedFacets?.some((f) => f.key === 'brand' && f.value === 'Nike') ? '✓' : ''}
      </button>
    </div>
  )
}
```

## Common failure modes

- Creating a custom React Context for cart state (`CartContext`, `useReducer`) — disconnects from VTEX platform validation, analytics, and checkout.
- Storing session data (locale, currency, postal code) in `localStorage` — the SDK's `validateSession` mutation never fires, so the platform is out of sync.
- Building custom search state with `useState` — loses URL synchronization, breaks back-button navigation, and bypasses the SDK's optimized query generation.
- Ignoring the `isValidating` flag from `useCart()` — users can proceed to checkout with stale prices or out-of-stock items.
- Using `useCart_unstable` or `useSession_unstable` hooks without understanding they have unstable interfaces that may change.

## Review checklist

- [ ] Is cart state managed exclusively via `useCart()` from `@faststore/sdk`?
- [ ] Is session data accessed exclusively via `useSession()` from `@faststore/sdk`?
- [ ] Is search state managed via `useSearch()` within a `SearchProvider` context?
- [ ] Is the `isValidating` flag checked before allowing checkout navigation?
- [ ] Is there no custom React Context, Redux, or Zustand store duplicating SDK state?
- [ ] Is there no direct `localStorage`/`sessionStorage` access for session-related data?

## Reference

- [FastStore SDK overview](https://developers.vtex.com/docs/guides/faststore/sdk-overview) — Introduction to the SDK modules and their responsibilities
- [useCart hook](https://developers.vtex.com/docs/guides/faststore/sdk-use-cart) — API reference for the cart hook with all properties and functions
- [Cart module overview](https://developers.vtex.com/docs/guides/faststore/cart-overview) — Cart data structure, validation, and platform integration
- [Session module](https://developers.vtex.com/docs/guides/faststore/sdk-session) — Session data structure, currency, locale, and channel management
- [useSearch hook](https://developers.vtex.com/docs/guides/faststore/sdk-use-search) — API reference for the search hook with sorting, facets, and pagination
- [SearchProvider](https://developers.vtex.com/docs/guides/faststore/search-search-provider) — Context provider required for useSearch to function
- [Analytics module](https://developers.vtex.com/docs/guides/faststore/sdk-analytics) — GA4-compatible analytics event tracking
- [Experimental hooks and components](https://developers.vtex.com/docs/guides/faststore/sdk-experimental-exports) — Unstable hooks for advanced use cases (useCart_unstable, useSession_unstable)
- [`faststore-data-fetching`](../faststore-data-fetching/SKILL.md) — Related skill for fetching product data via the GraphQL API
