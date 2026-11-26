# ADR-0001. Contrato do priceState

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

A linha do minicart precisa saber se o número é um preço que o comprador pode ver. Intelligent Search e Checkout podem omitir esse estado. A fase 2 lê o objeto cru da origem para limitar o TTL. A integração devolve `priceVariations`. O BFF não lê as chaves. Em `packages/api/src/platforms/vtex/typeDefs/offer.graphql`, `StoreOfferPriceState` tem `available: Boolean!` e `reasonKey: String`. `packages/api/src/platforms/vtex/resolvers/offer.ts` chama `resolvePriceState()` sem argumento.

## Decision

`StoreOfferPriceState` tem `available: Boolean!`, `reasonKey` como enum GraphQL anulável, e `priceVariations: JSONObject` anulável. Sem `priceState` na origem, `available` é `true` e `reasonKey` é nulo. O `reasonKey` da origem só segue quando `available` é `false`. `priceVariations` é copiado quando a origem manda o objeto. Sem objeto, o campo GraphQL é nulo: o BFF não cria `{}`. O BFF não lê as chaves. A lista de membros do enum fica fora desta decisão. `reasonKey` publicado segue `String` até essa lista existir.

## Consequences

A fase 2 distingue o default do objeto da origem: o resolver vê o campo cru antes de aplicar `available: true`. O BFF não lê as chaves de `priceVariations`. Quem devolve o objeto é a integração. Trocar `String` por enum rejeita um `reasonKey` fora da lista no dia em que a lista existir. Até lá, `offer.graphql` permanece com `String`. `scalar JSONObject` está declarado em `packages/api/src/platforms/vtex/typeDefs/userOrder.graphql`, e `getResolvers` em `packages/api/src/platforms/vtex/resolvers/index.ts` não registra esse scalar. A implementação do campo registra `serialize` e `parse` que devolvem o objeto. O fragmento do carrinho que já pede `reasonKey` muda o hash da persisted query quando o tipo do campo muda.
