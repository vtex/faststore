# Preço da linha no minicart

> **Status**: Done
> **Last updated**: 2026-11-16

## Goal

A linha do minicart mostra preço, brinde ou motivo a partir do número e de `available`.

## Success Criteria

| # | Criterion | Traces to |
|---|---|---|
| C1 | A resposta de `validateCart` traz `priceState { available, reasonKey }` e os preços seguem `Float!` | adr-0003 `Decision`; TDD `Interfaces` |
| C2 | Zero com `available` verdadeiro continua na lista de brindes. Zero com `available` falso fica na lista de itens, mostra a frase e soma zero | adr-0003 `Decision`; TDD `Key Flows > Linha sem preço e brinde` |
| C3 | O FastStore não lê `isGift` do OrderForm. Preço menor que um centavo continua com o sufixo `Gift` no identificador | adr-0003 `Decision` |
| C4 | Número acima de zero com `available` verdadeiro segue formatado. `available` falso mostra a frase da chave conhecida, e a frase genérica nas demais | adr-0003 `Decision` |
| C5 | O botão de checkout continua desabilitado só durante a validação. O POST do carrinho segue `no-cache, no-store`. O GET e o PATCH de itens seguem com `sc` | adr-0003 `Context`; adr-0004 `Decision`; TDD `Cross-Cutting Concerns` |

## Recon

| Area | Finding |
|---|---|
| `packages/api/src/typeDefs/offer.graphql` | `StoreOffer` tem `price: Float!` e não tem `priceState` |
| `packages/api/src/platforms/vtex/resolvers/offer.ts` | `price` do item de busca usa `spotPrice ?? 0`. O item do OrderForm usa `sellingPrice / 100`. O resolver não lê `isGift` |
| `packages/api/src/platforms/vtex/resolvers/validateCart.ts` | `getId` acrescenta `Gift` quando `price < 0.01`. `orderFormItemToOffer` copia `sellingPrice / 100` e não copia `isGift` |
| `packages/api/src/platforms/vtex/clients/commerce/types/OrderForm.ts` | O item tem `isGift: boolean` e não tem `priceState` |
| `packages/core/src/sdk/cart/index.ts` | `isGift` é `item.price === 0`. `useCart` separa `gifts` e `items` com essa função e soma `price * quantity` em `total` |
| `packages/core/src/sdk/cart/index.ts` | O fragmento `CartItem` pede `price` e não pede `priceState` |
| `packages/core/src/components/cart/CartItem/CartItem.tsx` | A linha passa `price` e `useFormattedPrice` para `UICartItem` |
| `packages/core/src/sdk/cart/useCheckoutButton.ts` | `disabled` é `isValidating` |
| `packages/core/src/pages/api/graphql.ts` | Mutação sem `cacheControl` responde `no-cache, no-store` |
| `packages/api/test/integration/schema.test.ts` | O teste exige os nomes de tipo em `TYPES` e aceita o schema com `assertValidSchema` |
| `packages/api/src/platforms/vtex/index.ts` | `FeatureFlags` tem `enableOrderFormSync` e `enableUnavailableItemsOnCart` | 

## Approach

`StoreOffer` ganha `priceState` obrigatório ao lado dos números. O resolver devolve `{ available: true, reasonKey: null }` enquanto o OrderForm e a oferta de busca não trouxerem o campo. O carrinho pede o campo, separa o brinde com `price === 0` e `available`, e a linha com `available` falso mostra a frase no lugar da moeda. O identificador, o `sc` e o header do POST permanecem.

## Steps

1. **Função do estado** — criar `resolvePriceState` e `priceReasonLabel` em `packages/api/src/platforms/vtex/utils/priceState.ts`. Sem campo de origem, o resultado é `{ available: true, reasonKey: null }`. Com `available: false`, devolve a chave recebida. `priceReasonLabel` devolve a frase de `PRICE_REQUIRES_LOGIN` e, para qualquer outra chave, `calculando`.
   **Verify:** `pnpm --filter @faststore/api test:unit -- test/unit/platforms/vtex/utils/priceState.test.ts`
2. **Schema e resolver** — em `packages/api/src/typeDefs/offer.graphql`, adicionar `StoreOfferPriceState` com `available: Boolean!` e `reasonKey: String`, e `priceState: StoreOfferPriceState!` em `StoreOffer`. Os `Float!` permanecem. `offer.ts` implementa `priceState` com `resolvePriceState`. Incluir `StoreOfferPriceState` em `TYPES` de `packages/api/test/integration/schema.test.ts`.
   **Verify:** `pnpm --filter @faststore/api test:int -- test/integration/schema.test.ts`
3. **Carrinho** — no fragmento `CartItem` de `packages/core/src/sdk/cart/index.ts`, pedir `priceState { available reasonKey }`. `isGift` passa a ser preço zero com `available` diferente de falso. Item sem `priceState` continua brinde quando o preço é zero. `total` soma zero quando `available` é falso. Rodar `pnpm --filter @faststore/core generate`.
   **Verify:** `pnpm --filter @faststore/core test -- test/sdk/cart/priceLine.test.ts`
4. **Linha** — em `packages/core/src/components/cart/CartItem/CartItem.tsx`, quando `priceState.available` é falso, o `formatter` devolve `priceReasonLabel(reasonKey)` no lugar da moeda.
   **Verify:** `pnpm --filter @faststore/core test -- test/sdk/cart/priceLine.test.ts`

## Verification

- **C1** — `pnpm --filter @faststore/api test:int -- test/integration/schema.test.ts` e o fragmento `CartItem` pede `priceState`
- **C2** — `pnpm --filter @faststore/core test -- test/sdk/cart/priceLine.test.ts` cobre brinde, linha com motivo e total zero
- **C3** — `pnpm --filter @faststore/api test:unit -- test/unit/platforms/vtex/utils/priceState.test.ts` não lê `isGift`. `rg -n "price < 0.01" packages/api/src/platforms/vtex/resolvers/validateCart.ts` continua casando o sufixo `Gift`
- **C4** — o teste de `priceReasonLabel` cobre `PRICE_REQUIRES_LOGIN` e uma chave desconhecida
- **C5** — `rg -n "disabled: isValidating" packages/core/src/sdk/cart/useCheckoutButton.ts` continua casando. `rg -n "no-cache, no-store" packages/core/src/pages/api/graphql.ts` continua casando. `rg -n "sc" packages/api/src/platforms/vtex/clients/commerce/index.ts` continua casando o GET e o PATCH de itens

## Risks & Open Questions

O OrderForm não tem `priceState`. A validação confirma o número com `available: true`, e o motivo copiado da prateleira dura até o POST voltar.

A chave de cache de preço por item do Checkout não está neste repositório. Falta confirmar que ela inclui `sc`.

## References

| Doc | Type | Why it matters here |
|---|---|---|
| [adr-0003](../adrs/adr-0003-estado-do-preco-no-minicart-e-checkout.md) | Binding (ADR) | Tabela da linha, `priceState` e o sufixo `Gift` |
| [adr-0004](../adrs/adr-0004-contexto-de-preco-no-checkout.md) | Binding (ADR) | Esta fase grava só o `sc` |
| [adr-0002](../adrs/adr-0002-union-de-preco-via-intelligent-search.md) | Binding (ADR) | Números `Float!` e a frase genérica |
| [tdd-minicart-checkout-preco.md](../tdds/tdd-minicart-checkout-preco.md) | Reference | Fragmento, linha e botão de checkout |
| [roadmap](../roadmaps/preco-minicart-e-vitrine/roadmap.md) | Roadmap (Phase #1) | Contrato desta fase. Fragmento reservado em `carryover-phase-1.md` |
