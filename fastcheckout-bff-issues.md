# Fix Cart Page GraphQL Queries to Match BFF Schema

## Context

The `/cart` page GraphQL queries fail because they use field names and structures that don't match the FastCheckout BFF schema. The BFF uses union types, index-based mutations, and different field naming than what was assumed.

## Files to Modify

1. **`packages/core/src/sdk/checkout/operations/cartOperations.ts`** — Rewrite queries, mutations, and types
2. **`packages/core/src/sdk/checkout/useCheckoutCart.ts`** — Adapt data mapping layer
3. **`packages/core/src/components/cart/CartPage/CartPage.tsx`** — Update to new data shape
4. **`packages/core/src/components/cart/CartPage/CartPageCartItem.tsx`** — Use `Product` type fields
5. **`packages/core/src/components/cart/CartPage/CartPageSummary.tsx`** — Use `Summary` totalizers structure
6. **`packages/core/src/components/cart/CartPage/ShippingPreview.tsx`** — Use `DeliveryUnion` shape
7. **`packages/core/src/components/cart/CartPage/CartUnavailableItems.tsx`** — Use unavailable product type

## Key Schema Differences

### Cart
- `cart` returns `CartUnion` = `Cart | EmptyCart` — must use inline fragments
- `Cart` has: `id`, `total` (string), `totalItems`, `availableItems: [Product!]!`, `unavailableItems: [BaseProductUnavailable!]!`
- No `items`, `totalizers`, or `value` on Cart

### Product (cart items)
- Uses `id` (ID) and `itemId` (string) — no `uniqueId`
- `originalIndex` (Int) — needed for mutations
- `productUrl` not `detailUrl`
- `price` is `ProductPriceUnion` = `Price | PriceWithDiscount` with `PriceValue { asCurrency, asNumber }`
- `seller` is `{ id, name }` object
- No `variations`, `availability`, or `availableQuantity` fields

### Mutations (index-based, not ID-based)
- `changeProductQuantity(itemIndex: Int!, quantity: Int!, userIsoDate: String!)` → `ChangeProductQuantityPayload`
- `removeProduct(input: { itemIndex: Int!, userIsoDate: String! })` → `RemoveProductsPayload`
- `removeProducts(input: { itemsIndexes: [Int!]!, userIsoDate: String! })` → `RemoveProductsPayload`
- `addPromoCode(input: { newPromoCode: String!, promoCodes: [String!]! })` → `AddPromoCodePayload`
- `removePromoCode(promoCode: String!, promoCodes: [String!]!)` → `ChangePromoCodesPayload`

### Summary (separate root query)
- `summary { total { asCurrency, asNumber }, totalizers { items, discounts, shipping { ... on ShippingTotalizer { value } ... on FreeShippingTotalizer { type } } } }`

### Shipping
- `shipping.delivery` is `DeliveryUnion` = `Delivery | EmptyDelivery | NoSlasDelivery | PreviewDelivery`
- Address lives inside `Delivery.address` / `PreviewDelivery.address`
- `Delivery.options` are `DeliverySla` unions (not flat objects)

### StorePreferences
- Only `currency` (ISO code) and `country` — no `currencySymbol` or `locale`
- Will use `navigator.language` for locale (per user preference)

## Implementation Steps

### Step 1: Rewrite `cartOperations.ts`

Rewrite all GraphQL query/mutation strings and TypeScript types to match the actual BFF schema.

**CART_PAGE_QUERY**: Query `cart` (with union fragments), `summary`, `shipping`, `storePreferences`, `coupon`

**Mutations**: Update all 5 mutations to use correct argument signatures and return payload types. All mutation payloads return `{ cart, summary, errors }` (or similar) — we select the fields we need.

**Types**: New interfaces matching BFF schema: `BffProduct`, `BffPriceValue`, `BffSummary`, `BffDelivery`, etc.

### Step 2: Update `useCheckoutCart.ts`

- Map `Cart.availableItems` → `items`, `Cart.unavailableItems` → `unavailableItems`
- Use `Product.originalIndex` as the identifier for mutations (passed as `itemIndex`)
- Use `summary.total.asNumber` → `cartValue`
- Build totalizer display array from `summary.totalizers` named fields
- Handle `EmptyCart` variant (no items)
- Track applied promo codes from `coupon` query data
- Mutations pass `userIsoDate: new Date().toISOString()` and index-based params
- For `addPromoCode`: pass current promo codes list + new code
- For `removePromoCode`: pass remaining promo codes + code to remove
- Use `navigator.language` for locale

### Step 3: Update components

- **CartPageCartItem**: Props use `BffProduct` type. Extract selling/list price from `ProductPriceUnion`. Use `productUrl` for links. Remove `variations` display. Use `originalIndex` for quantity/remove callbacks.
- **CartPageSummary**: Build display from `summary.totalizers` named fields (`items`, `discounts`, `shipping`).
- **ShippingPreview**: Handle `DeliveryUnion` with `__typename` checks. Show address from `Delivery`/`PreviewDelivery`. Show delivery options from `Delivery.options`.
- **CartUnavailableItems**: Use `BaseProductUnavailable` fields (`id`, `name`, `skuName`, `imageUrl`).
- **CartPage**: Use `storePreferences.currency` directly. Get locale from `navigator.language`.

## Verification

1. Ensure BFF server running on `localhost:3001`
2. Run `yarn dev` for faststore core
3. Navigate to `/cart` — verify no GraphQL errors in network tab
4. Test: items display with names, images, prices
5. Test: quantity change and item removal
6. Test: empty cart state
7. Test: shipping preview
8. Test: coupon add/remove
