# ADR-0003. TTL da CDN só com priceState da origem

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

`Query.product` e `Query.search` declaram `@cacheControl(scope: "public", sMaxAge: 300, staleWhileRevalidate: 3600)`. A diretiva grava esse par em `ctx.cacheControl` antes do resolver. `PriceValidUntil` já vem em toda oferta comercial da Intelligent Search. `resolvePriceState()` sem origem devolve `available: true`. Usar a data em toda resposta encurtaria o cache das lojas cujo payload não traz `priceState`.

## Decision

O TTL da CDN muda só quando alguma oferta comercial do payload da Intelligent Search traz um objeto `priceState`. Sem esse objeto, `s-maxage` fica 300 e `stale-while-revalidate` fica 3600. Com ele, `s-maxage` é `min(300, segundos até a PriceValidUntil mais cedo entre essas ofertas)` e `stale-while-revalidate` é `min(3600, esses mesmos segundos)`. Data ilegível fica fora da conta. Data no passado zera os dois. O default de `resolvePriceState` não liga o cap. `discovery.config` não liga o cap. `validateCart` não altera esse TTL. Este repositório não escreve o TTL do Janus.

## Consequences

Uma loja cujo payload omite `priceState` permanece em 300 e 3600, mesmo com `PriceValidUntil` preenchido. Uma data no passado, entre as ofertas que trouxeram o objeto, faz a CDN revalidar na hora: os dois valores ficam 0. O cookie de autenticação continua forçando `private` em `stringify`; o cap só altera os dois números. `validateCart` segue `no-store` porque não recebe esse hint. O cliente de busca não envia `Cache-Control` ao Janus, e o teto de 10 minutos de lá permanece fora desta entrega. O cap não entra no `skuLoader`: esse loader também serve o carrinho, e gravar `ctx.cacheControl` ali anexaria `s-maxage` à mutation.
