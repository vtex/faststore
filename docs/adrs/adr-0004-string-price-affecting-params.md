# ADR-0004. String opcional priceAffectingParams

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

Quantidade e meio de pagamento mudam o preço de alguns clientes e não são argumento de `Query.product` nem de `Query.search`. O cache da CDN usa o JSON de `variables` na URL do GET. A chave do Janus é a URL `product-search` que `buildIntelligentSearchRequest` monta. Um campo nativo por cliente partiria o cache de quem não usa a feature. `validateCart` atualiza o orderForm e o custom app `faststore` hoje só grava `cartEtag`.

## Decision

`product`, `search` e `validateCart` aceitam `priceAffectingParams: String`, opcional. Ausente, `null` e `""` não seguem. O BFF copia o texto e não lê nem reordena as chaves. O cliente ordena as chaves. Nas buscas, o texto entra como query param na URL da Intelligent Search. A mesma string volta em `priceState.priceAffectingParams` em cada oferta da resposta. Sem string, o campo GraphQL é nulo: o BFF não inventa texto. `validateCart` aceita a string, segue POST e `no-store`, e devolve na linha a string recebida. A gravação no orderForm espera um campo já nomeado. Esta decisão não cria `customData`. Essa mutation não é chave de CDN nem de Janus. As queries nativas de produto e de busca não declaram a variável e não enviam a string. `quantity` e `paymentMethod` não viram argumento. `useOffer` e o HTML estático ficam fora.

## Consequences

Quem envia a string ganha outra entrada de CDN, porque o GET leva `variables`, e outra entrada de Janus, porque a URL `product-search` ou `products` leva o texto. `{}` ou outra ordem de chaves é outra entrada. Uma variável não declarada muda a URL da CDN e o resolver não vê o valor. O campo `priceAffectingParams` entra em `priceState` ao lado dos campos de [ADR-0001](adr-0001-contrato-do-price-state.md). O fragmento do carrinho que passar a pedi-lo muda o hash da persisted query uma vez. O nome do campo no orderForm não está escolhido. O custom app `faststore` continua com `cartEtag`. Esta decisão não cria campo novo de `customData`. `useOffer` chama `/api/intelligent-search/product_search` com `sku.id` e não vê o argumento.
