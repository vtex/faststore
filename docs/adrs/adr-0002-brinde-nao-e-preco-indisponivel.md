# ADR-0002. Brinde é preço zero disponível

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

O minicart trata preço zero como brinde. Um preço indisponível também pode ser zero. Classificar essa linha como brinde tira o item da lista, do contador e do lugar onde a frase aparece. `isGift` em `packages/core/src/sdk/cart/priceLine.ts` exige `price === 0` e `priceState.available` diferente de `false`. `getBaseId` em `packages/api/src/platforms/vtex/resolvers/validateCart.ts` acrescenta o segmento `Gift` quando `price < 0.01`, sem ler `available`.

## Decision

Uma linha é brinde quando `price === 0` e `priceState.available` não é `false`. Sem `priceState`, preço zero continua brinde. `available: false` fica na lista de itens. `lineTotal`, `lineTotalWithTaxes` e o valor passado a `subtotalAmount` ficam 0. `experimental.useIsGiftFromOrderForm` permanece, com default `false` em `packages/core/discovery.config.default.js`. Com a flag desligada, vale a regra de preço. `getBaseId` continua acrescentando `Gift` quando `price < 0.01`.

## Consequences

Uma linha indisponível com preço zero entra na lista de itens, conta em `totalItems` e soma zero. Um carrinho só de brindes fica com `items` vazio e `gifts` preenchido. `isEmpty` em `CartSidebar` é `items.length === 0 && gifts.length === 0`, então esse carrinho não aparece vazio. A flag experimental, quando ligada, lê `item.isGift` e não aplica a regra de preço. Uma linha com `price < 0.01` e `available: false` carrega `Gift` no id e não entra na lista de brindes.
