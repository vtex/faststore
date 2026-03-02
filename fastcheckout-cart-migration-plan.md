# FastCheckout Cart UI Migration to FastStore

## Context

FastStore currently has no full cart page — only a mini-cart sidebar (`CartSidebar`) that redirects to an external checkout URL. We're porting the FastCheckout Cart screen (`screens/Cart/`) into FastStore as an independent `/cart` route that communicates with the existing FastCheckout BFF (hardcoded at `localhost:3001`, already running).

**Scope**: Standard delivery mode only (no multi-delivery). The existing mini-cart sidebar remains unchanged.

**Exclusions**: OneClickCheckout, ApplePay, GooglePay, B2B features, Extension Points, HearstTermsAndConditions, multi-delivery mode.

**Skipped**: No new UI components in `packages/ui`. We'll build directly in `packages/core` using existing `@faststore/ui` components and inline styles where needed.

---

## Phase 1: BFF Proxy & Data Layer

### 1.1 Create BFF Proxy API Route
**File**: `packages/core/src/pages/api/checkout-bff.ts`

Next.js API route proxying GraphQL to `http://localhost:3001/graphql`. Forwards cookies, proxies `set-cookie` back.

**Pattern**: `packages/core/src/pages/api/graphql.ts`

**Verify**: BFF is running on 3001. Test proxy with a simple CartPageQuery request.

### 1.2 Create BFF GraphQL Client
**File**: `packages/core/src/sdk/checkout/bffClient.ts`

Fetch client targeting `/api/checkout-bff` with raw GraphQL strings (not persisted queries).

### 1.3 Create SWR Hooks for BFF
**Files**:
- `packages/core/src/sdk/checkout/useBffQuery.ts` — SWR wrapper
- `packages/core/src/sdk/checkout/useBffMutation.ts` — mutation + revalidation

### 1.4 Define GraphQL Operations
**File**: `packages/core/src/sdk/checkout/operations/cartOperations.ts`

**Query**: `CartPageQuery` → fetches cart, summary, shipping, coupon, storePreferences

**Mutations**: ChangeProductQuantity, RemoveProduct, RemoveProducts (bulk), AddPromoCode, RemovePromoCode

### 1.5 Create Main Cart Hook
**File**: `packages/core/src/sdk/checkout/useCheckoutCart.ts`

Central hook combining all BFF queries + mutation functions.

---

## Phase 2: Core Components & Page (`packages/core`)

### 2.1 CartPage (Main Component)
**Files**: `packages/core/src/components/cart/CartPage/CartPage.tsx` + `cart-page.module.scss`

Uses existing `@faststore/ui` components (CartItem, OrderSummary, Button, Icon, Skeleton, QuantitySelector) + SCSS modules for layout. Composes:

```
<div data-fs-cart-page> (two-column via CSS module)
  Content:
    CartListHeader (simple heading — built inline or as small sub-component)
    ShippingChannelSelector (tabs — built inline)
    CartItemList (using @faststore/ui CartItem per item)
    CartUnavailableItems
  Sidebar:
    ShippingPreview (delivery/pickup info)
    CouponSection (input + applied codes)
    OrderSummary (reuse existing)
    CartActionButton
    CartActionMobile (sticky bottom)
```

### 2.2 CartPageCartItem
**File**: `packages/core/src/components/cart/CartPage/CartPageCartItem.tsx`

Maps BFF Product → `@faststore/ui` CartItem. Calls `changeQuantity`/`removeProduct` from useCheckoutCart.

### 2.3 ShippingPreview
**File**: `packages/core/src/components/cart/CartPage/ShippingPreview.tsx`

Displays delivery/pickup info from BFF shipping data. Built with basic HTML + CSS module styling.

### 2.4 CouponSection
**File**: `packages/core/src/components/cart/CartPage/CouponSection.tsx`

Input + button for adding promo codes, list of applied codes with remove. Uses `@faststore/ui` Button + InputField.

### 2.5 CartPageSummary
**File**: `packages/core/src/components/cart/CartPage/CartPageSummary.tsx`

Maps BFF Summary totalizers → reuse `@faststore/ui` OrderSummary or build simple table.

### 2.6 CartActionButton
**File**: `packages/core/src/components/cart/CartPage/CartActionButton.tsx`

"Continue to Checkout" button.

### 2.7 CartUnavailableItems
**File**: `packages/core/src/components/cart/CartPage/CartUnavailableItems.tsx`

Unavailable items with bulk remove.

### 2.8 CartPageSkeleton
**File**: `packages/core/src/components/cart/CartPage/CartPageSkeleton.tsx`

Loading skeletons.

---

## Phase 3: Page Route & Integration

### 3.1 Create `/cart` Page
**File**: `packages/core/src/pages/cart.tsx`

Dynamic import (client-side only). Pattern: `packages/core/src/pages/checkout.tsx`.

### 3.2 Empty Cart State
Reuse `packages/core/src/components/cart/EmptyCart/`.

### 3.3 Analytics Events
view_cart on mount, remove_from_cart/add_to_cart on mutations. Pattern: CartSidebar.tsx.

---

## New File Tree

```
packages/core/src/
  pages/
    cart.tsx                              [NEW]
    api/
      checkout-bff.ts                    [NEW]
  sdk/
    checkout/
      bffClient.ts                       [NEW]
      useBffQuery.ts                     [NEW]
      useBffMutation.ts                  [NEW]
      useCheckoutCart.ts                 [NEW]
      operations/
        cartOperations.ts               [NEW]
  components/
    cart/
      CartPage/
        CartPage.tsx                     [NEW]
        CartPageCartItem.tsx             [NEW]
        ShippingPreview.tsx              [NEW]
        CouponSection.tsx                [NEW]
        CartPageSummary.tsx              [NEW]
        CartActionButton.tsx             [NEW]
        CartUnavailableItems.tsx         [NEW]
        CartPageSkeleton.tsx             [NEW]
        cart-page.module.scss            [NEW]
        index.ts                         [NEW]
```

## Existing Components to Reuse
- CartItem, QuantitySelector, OrderSummary, Button, Icon, Skeleton from `@faststore/ui`
- EmptyCart from `@faststore/core`

---

## Verification

1. **Phase 1**: Test `/api/checkout-bff` proxy — verify BFF responds with cart data through proxy
2. **Phase 2-3**: Navigate to `/cart`, verify items render, quantity/remove mutations work, shipping preview displays, coupon add/remove works, summary totals correct, empty cart shows, mobile responsive
