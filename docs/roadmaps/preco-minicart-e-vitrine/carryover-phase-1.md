# Carry-over — Phase 1: Preço da linha no minicart

> **From**: preco-minicart-e-vitrine, Phase #1
> **Source**: branch `feat/cart-price-state`

## Facts

| Affects | Fact |
|---|---|
| #2 | `StoreOffer.priceState` already exists. `offer.ts` calls `resolvePriceState()` with no source, so every offer returns `available: true` until the search branch receives the Intelligent Search field. |
| #2 | `priceReasonLabel` is exported from `@faststore/api`. `formatCartLinePrice` in `packages/core/src/sdk/cart/priceLine.ts` already turns `available: false` into that phrase. |
| #2 | Client `CartItem.priceState` is optional. Shelf add-to-cart still compiles when the product fragment does not request the field. |
| #2 | `StoreAggregateOffer` does not have `priceState` yet. |
| #2 | The OrderForm item type in this repo still has no `priceState`. The cart cannot read a reason from Checkout. |
