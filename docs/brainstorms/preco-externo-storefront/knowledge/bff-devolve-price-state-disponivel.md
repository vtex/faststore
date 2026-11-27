---
kind: project-analysis
source: packages/api/src/platforms/vtex/utils/priceState.ts
read: 2026-11-26
confidence: high
tags: [price-state, rollout]
---

# Sem origem, o BFF devolve o preço como disponível

**Evidence:** `resolvePriceState` sem `source`, ou com `available` diferente de `false`, retorna `{ available: true, reasonKey: null }`. Com `available === false`, repete a `reasonKey` recebida. `offer.ts` chama `resolvePriceState()` sem origem. O tipo em `offer.graphql` é `priceState: StoreOfferPriceState!` com `available: Boolean!` e `reasonKey: String`. `priceValidUntil` no mesmo tipo é `String!`.

**Applies when:** a conta não manda estado, ou a flag da integração está desligada.

**Breaks when:** o resolver passar a ler um campo da Intelligent Search ou do OrderForm e esse campo vier `available: false` para uma conta sem a feature.
