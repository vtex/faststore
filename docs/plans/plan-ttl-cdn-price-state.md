# TTL da CDN quando o priceState vem

> **Status**: Reviewed
> **Roadmap**: preco-minicart-e-vitrine #2
> **Branch**: preco-minicart-e-vitrine/p2-ttl-price-valid-until
> **PR**: —
> **Last updated**: 2026-11-26

## Goal

A resposta de produto e de busca passa a sair com `s-maxage` e `stale-while-revalidate` menores que 300 e 3600 só quando alguma oferta comercial da Intelligent Search trouxe o objeto `priceState`, e só até a `PriceValidUntil` parseável mais cedo.

## Success Criteria

| # | Criterion | Traces to |
|---|---|---|
| C1 | Sem objeto `priceState` cru em nenhuma oferta comercial, o hint permanece `sMaxAge` 300 e `staleWhileRevalidate` 3600, mesmo com `PriceValidUntil` preenchido | Roadmap fase 2 In; ADR-0003 Decision; TDD `Key Flows > Resposta sem priceState cru` |
| C2 | Com o objeto, `sMaxAge` fica `min(300, segundos inteiros até a data parseável mais cedo entre essas ofertas)` e `staleWhileRevalidate` fica `min(3600, esses mesmos segundos)`. Data além de 3600 segundos mantém os dois tetos. Data no passado, ou restante menor que 1 segundo, grava 0 nos dois | Roadmap fase 2 In; ADR-0003 Decision; TDD `Key Flows > Cap pela data`; sessão `Threads > Cache da fase 2` |
| C3 | Data ilegível fica de fora. Se nenhuma data válida resta, o hint permanece 300 e 3600. `null`, campo ausente, array e valor primitivo não ligam o cap. O objeto devolvido por `resolvePriceState()` sem origem também não liga | TDD `Key Flows > Cap pela data`; ADR-0003 Decision; ADR-0001 Consequences |
| C4 | O cap roda em `Query.product` (caminho do `skuLoader` e fallback de slug), `Query.allProducts`, `Query.products`, `StoreSearchResult.products` e `StoreSearchResult.suggestions` quando esse campo lê produtos. `skuLoader`, `validateCart`, `Query.search`, `facets`, `metadata`, `searchId` e o caminho de top searches sem produtos ficam sem o cap. `scope` permanece | Roadmap fase 2 In; TDD Building Blocks e `Key Flows > validateCart fora do cap`; ADR-0003 Consequences |
| C5 | O cap não lê `discovery.config`. O cliente de Intelligent Search segue sem `Cache-Control` na ida. O header continua saindo de `getSuccessCacheControl` a partir do hint. `reasonKey` em `offer.graphql` permanece `String` | ADR-0003 Decision; ADR-0001 Decision; TDD Cross-Cutting Concerns; roadmap fase 2 Out |

## Recon

| Area | Finding |
|---|---|
| `packages/api/src/platforms/vtex/typeDefs/query.graphql` | `product` (223), `search` (265), `allProducts` (280) e `products` (286) declaram `@cacheControl(scope: "public", sMaxAge: 300, staleWhileRevalidate: 3600)`. `suggestions` não tem diretiva própria; herda o hint do campo `search` |
| `packages/api/src/directives/cacheControl.ts` | A diretiva grava em `ctx.cacheControl` o menor `sMaxAge`, o menor `staleWhileRevalidate` e o scope mais restrito, e só então chama o resolver (76–85). `stringify` troca o scope para `private` quando `forcePrivate` é verdadeiro (28) |
| `packages/core/src/pages/api/graphql.ts` | `getSuccessCacheControl` devolve `stringify` do hint quando ele existe (318–319). `experimental.graphqlCacheControl` de `discovery.config` só entra sem hint (322–343). Sem hint, GET cujo nome termina em `query` cai no default; o resto responde `no-cache, no-store` (322–326) |
| `packages/core/src/server/index.ts` | `execute` copia `contextValue.cacheControl` para `extensions.cacheControl` (158) |
| `packages/core/discovery.config.default.js` | `experimental.graphqlCacheControl` está em 202–205. O cap não lê esse bloco |
| `packages/api/src/platforms/vtex/resolvers/query.ts` | `Query.product` (210–238) obtém o SKU por `skuLoader` ou por `fetchProductBySlugFallback` (154–183) e devolve um `EnhancedSku`. `Query.search` (339–341) devolve `productSearchPromise` sem aguardar o payload. `allProducts` (353–377) e `products` (392–403) já têm os produtos da busca na mão |
| `packages/api/src/platforms/vtex/resolvers/searchResult.ts` | `products` (64–89) aguarda `productSearchPromise` e escolhe um SKU com `pickBestSku`. `suggestions` (29–38) sem `searchArgs.query` devolve `products: []` via `topSearches`. Com query (42–61), aguarda o mesmo payload. `facets`, `metadata` e `searchId` também aguardam busca ou facetas e não devolvem oferta |
| `packages/api/src/platforms/vtex/utils/enhanceSku.ts` | `enhanceSku` guarda o produto inteiro, com `items`, em `isVariantOf` (16–18). O produto do fallback de slug chega pelo mesmo caminho |
| `packages/api/src/platforms/vtex/loaders/sku.ts` | O loader chama `productsByIdentifier` e devolve `EnhancedSku`. Não recebe contexto e não escreve hint. `validateCart.ts` usa o mesmo loader |
| `packages/api/src/platforms/vtex/utils/priceState.ts` | `resolvePriceState()` sem origem devolve `{ available: true, reasonKey: null }` |
| `packages/api/src/platforms/vtex/resolvers/offer.ts` | `priceState` (81) chama `resolvePriceState()` sem a oferta. O campo GraphQL sai preenchido mesmo quando a origem não mandou objeto |
| `packages/api/src/platforms/vtex/typeDefs/offer.graphql` | `priceState: StoreOfferPriceState!` e `reasonKey: String` (72–80). `priceValidUntil: String!` (36) |
| `packages/api/src/platforms/vtex/typeDefs/aggregateOffer.graphql` | `StoreAggregateOffer` não tem `priceState`. O fragmento `carryover-phase-1.md` não existe; o log do roadmap registra o mesmo fato |
| `packages/api/src/platforms/vtex/clients/search/types/ProductSearchResult.ts` | `CommertialOffer.PriceValidUntil` é `string` (176). O tipo não tem `priceState` |
| `packages/api/src/platforms/vtex/clients/search/index.ts` | Os headers da ida são `content-type` e `X-FORWARDED-HOST` mais o cookie (172–175). Não há `Cache-Control` nem `s-maxage` |
| `packages/api/src/platforms/vtex/typeDefs/mutation.graphql` | `validateCart` (5) não declara `@cacheControl` |
| `packages/api/test/mocks/ProductQuery.ts` | A data de exemplo é ISO-8601 com `Z`: `2023-04-07T14:08:58Z` |
| `packages/api/test/unit/platforms/vtex/resolvers/query.test.ts` | `Query.product` já tem fixture `makeSku` / `makeProductCtx`. `isVariantOf.items` pode faltar nesse fixture. O cap precisa aceitar lista ausente sem lançar, senão essa suíte quebra |
| `docs/knowledge/INDEX.md` | Ausente. Notas locais lidas: `cache-graphql-e-estatico.md`, `bff-devolve-price-state-disponivel.md` |

## Approach

`applySearchCacheCap` lê `items[].sellers[].commertialOffer` do payload que o resolver já carregou e baixa os dois números já gravados em `ctx.cacheControl`. O sinal é o objeto cru. A frase de flag no primeiro parágrafo de `Threads > Cache da fase 2` perde para o parágrafo seguinte e para o ADR-0003: o sinal é esse objeto, e `discovery.config` fica de fora. Sem hint gravado, a função retorna sem criar política. `Query.search` continua só entregando a promise; quem devolve oferta aplica o cap. O cap fica fora do `skuLoader` porque esse loader também hidrata o carrinho, e gravar o hint ali anexaria `s-maxage` à mutation.

## Steps

A fase 2 está empilhada em `feat/cart-price-state` (`dev ← feat/cart-price-state ← preco-minicart-e-vitrine/p2-ttl-price-valid-until`). O loop não espera o merge da fase 1. Os passos abaixo são o ledger.

- [x] **1. Função do cap** — criar `applySearchCacheCap` em `packages/api/src/platforms/vtex/utils/searchCacheCap.ts` e o campo opcional `priceState?: Record<string, unknown> | null` em `CommertialOffer` (`packages/api/src/platforms/vtex/clients/search/types/ProductSearchResult.ts`). Assinatura: `(ctx: { cacheControl?: CacheControl }, items: Array<{ sellers?: Array<{ commertialOffer?: { PriceValidUntil?: string; priceState?: unknown } }> }> | undefined, now = Date.now()) => void`. O tipo `CacheControl` vem de `packages/api/src/directives/cacheControl.ts`. Não alargar `GraphqlContext`. Regras da função: sem `ctx.cacheControl`, retorna; lista ausente ou vazia retorna; percorre cada `commertialOffer`; objeto não nulo e não array liga o sinal; `null`, ausência, array e primitivo ficam de fora; entre as ofertas com objeto, `Date.parse` finito entra e o resto fica de fora; nenhuma data válida retorna sem escrever; `restante = max(0, floor((menorTimestamp - now) / 1000))`; grava `sMaxAge = min(atual, min(300, restante))` e `staleWhileRevalidate = min(atual, min(3600, restante))` só quando o atual é número; `scope` fica intocado. Testes em `packages/api/test/unit/platforms/vtex/utils/searchCacheCap.test.ts` com `now` fixo: sem objeto e com data; `priceState: null`; array; objeto `{}` com data válida; objeto `{ available: true, reasonKey: null }` na origem; data ilegível sozinha; data ilegível ao lado de data válida; data acima de 3600 segundos; data entre 300 e 3600; data abaixo de 300; data no passado ao lado de data futura; restante menor que 1 segundo; hint já menor que o cap; `scope` igual ao de entrada; contexto sem hint continua sem `cacheControl`.
  **Verify:** `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/searchCacheCap.test.ts`
  **Commit:** b09c2234290b08f1adb1c83cff26a69bb37deacc
- [x] **2. Chamadas nos resolvers** — no mesmo commit dos testes deste passo. Depois de `const sku = await loadSku()` em `Query.product`, chamar a função com `sku.isVariantOf?.items`. Em `Query.allProducts`, com `products.products.flatMap((product) => product.items)`. Em `Query.products`, com `products.flatMap((product) => product.items)`. Em `StoreSearchResult.products`, com todos os `items` de `productSearchResult.products`, inclusive o SKU que `pickBestSku` não escolheu. Em `StoreSearchResult.suggestions`, só no ramo que aguarda `productSearchPromise`, com esses mesmos `items`. `Query.search`, `facets`, `metadata`, `searchId`, o ramo `topSearches`, `sku.ts`, `validateCart.ts`, `offer.ts`, `offer.graphql`, `discovery.config.default.js` e `packages/api/src/platforms/vtex/clients/search/index.ts` ficam sem chamada e sem header novo. Testes em `packages/api/test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts`: `Query.product` baixa o hint quando `isVariantOf.items` traz o objeto e mantém 300/3600 sem ele; fallback com `skuLoader.load` rejeitando `NotFoundError` e `fetchProduct` devolvendo o produto com objeto também baixa; `allProducts` e `products` baixam; `StoreSearchResult.products` usa o item irmão, não só o SKU escolhido; `suggestions` com query baixa; `suggestions` sem query mantém o hint; `Query.search` e `metadata` mantêm o hint com o mesmo payload; `products` e `suggestions` na mesma resposta deixam o par no mesmo valor; `readFileSync` confirma ausência de `applySearchCacheCap` em `loaders/sku.ts`, `resolvers/validateCart.ts` e `clients/search/index.ts`, ausência de `Cache-Control` e `s-maxage` em `clients/search/index.ts`, e `reasonKey: String` ainda presente em `typeDefs/offer.graphql`.
  **Verify:** `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts test/unit/platforms/vtex/resolvers/query.test.ts`
  **Commit:** da6bf0a3df57464d33363feb0939b45da55b4e1c

## Verification

- **C1** — `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/searchCacheCap.test.ts test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` cobre oferta sem objeto e com `PriceValidUntil` preenchido — pass 2026-11-26, 2 files, 30 tests
- **C2** — o mesmo comando cobre data distante, data entre os tetos, data curta, data no passado e restante menor que 1 segundo — pass 2026-11-26, same run
- **C3** — o teste unitário cobre data ilegível, objeto com cara de default na origem, `null`, array e a ausência do campo — pass 2026-11-26, same run
- **C4** — `test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` cobre os cinco pontos de chamada e os pontos que ficam sem cap, inclusive `scope` — pass 2026-11-26, 11 tests in that file, included in the 30-test run
- **C5** — o mesmo arquivo lê `offer.graphql`, o cliente de busca e os loaders citados no passo 2 — pass 2026-11-26, included in that run
- **Suite** — `pnpm --filter @faststore/api test:unit` — pass 2026-11-26, 34 files, 468 tests

## Rulings

- `Date.parse` na string gravada; `NaN` fica de fora; segundos = `max(0, floor((ts - now) / 1000))` — os mocks usam ISO-8601 com `Z` em `packages/api/test/mocks/ProductQuery.ts` e o TDD pede segundos inteiros para baixo — data que `Date.parse` rejeita mantém o teto.
- Objeto presente sem data parseável não baixa o hint — TDD: sem data válida o hint segue 300 e 3600 — objeto com data vazia deixa a CDN em 5 minutos e 1 hora.
- A conta usa todos os `items[].sellers[].commertialOffer` do produto que o resolver já tem, inclusive o SKU que `pickBestSku` não escolheu — ADR-0003 fala da oferta comercial do payload, e `enhanceSku` guarda o produto em `isVariantOf` — um SKU irmão que vence antes encurta a resposta que ainda carrega esse produto.
- `suggestions` chama o cap só depois de aguardar `productSearchPromise`; top searches com `products: []` não chama — TDD limita a chamada a quando `suggestions` lê produtos — resposta só de termos populares permanece em 300 e 3600.
- A função só baixa número já gravado e não escreve hint quando `ctx.cacheControl` falta — TDD: a função só baixa o par; `validateCart` não pode ganhar `s-maxage` por uma chamada sem hint — um campo mais curto na mesma operação permanece mais curto.
- Sinal = objeto não nulo e não array — TDD: objeto presente liga; `null` e campo ausente não ligam — `priceState` em array não encurta o cache.
- `now` é argumento com default `Date.now()` — o teste precisa de um instante fixo — chamador que omite o argumento usa o relógio da parede.
- A fase 2 segue sem a fase 1 em `Merged` — em 2026-11-26 o loop foi instruído a empilhar com `gh stack` na branch anterior — o diff desta camada inclui a fase 1 até o PR 3592 entrar em `dev`.
- O argumento de `applySearchCacheCap` também aceita `headers?` — `{ cacheControl?: CacheControl }` é um tipo fraco e o TypeScript recusa `GraphqlContext`, que não declara o campo — alargar `GraphqlContext` sairia do plano, e a função não lê `headers`.
- `facets` e `searchId` entram no teste que mantém o hint de `Query.search` e `metadata` — C4 lista os dois como fora do cap — uma chamada ali baixaria o hint sem o passo nomear esses campos.
- O SHA de cada passo fica no commit seguinte — o hash do commit depende do arquivo do plano, então o commit não pode citar o próprio SHA — o ledger em HEAD aponta para o commit que introduziu o passo.

## Blockers

## Risks & Open Questions

A implementação corre nesta camada, com base em `feat/cart-price-state`. O PR 3592 continua aberto.

O teto de 10 minutos do Janus continua fora deste repositório. A pergunta aberta do roadmap sobre quem configura esse teto não bloqueia esta fase.

`carryover-phase-1.md` não está no disco. Os fatos usados saíram do Carry-over Log do roadmap.

Open Questions: nenhuma.

## References

| Doc | Type | Why it matters here |
|---|---|---|
| [adr-0003](../adrs/adr-0003-ttl-cdn-so-com-price-state-da-origem.md) | Binding (ADR) | Objeto cru, fórmula do `min`, scope intacto, `validateCart` e Janus fora |
| [adr-0001](../adrs/adr-0001-contrato-do-price-state.md) | Binding (ADR) | O default `available: true` não é o objeto da origem. `reasonKey` publicado segue `String` |
| [tdd-ttl-cdn-price-state](../tdds/tdd-ttl-cdn-price-state.md) | Binding (phase design) | Onde a função roda, o que não liga, e o par que ela só baixa |
| [sessão](../brainstorms/preco-externo-storefront/session.md) | Reference | `Threads > Cache da fase 2` |
| [cache-graphql-e-estatico](../brainstorms/preco-externo-storefront/knowledge/cache-graphql-e-estatico.md) | Reference | Diretiva 300/3600 e ausência de TTL no cliente de busca |
| [bff-devolve-price-state-disponivel](../brainstorms/preco-externo-storefront/knowledge/bff-devolve-price-state-disponivel.md) | Reference | `resolvePriceState()` sem origem devolve o default |
| [roadmap](../roadmaps/preco-minicart-e-vitrine/roadmap.md) | Roadmap (Phase #2) | Branch `preco-minicart-e-vitrine/p2-ttl-price-valid-until`, empilhada em `feat/cart-price-state` |

## Smell Review

O código revisto termina em `0577d0564aee97639710a3f161ef99a3a0b1416b`. O commit que só grava esta seção fica de fora. O plano permanece Built.

Complexidade ciclomática estimada à mão: o Biome não mede esse número e `lizard` não está instalado. A conta parte de 1 e soma `if`, `for`, `catch`, `&&`, `||`, `??` e ternário. `?.` fica de fora. O teto é 10.

| Função | CC estimada |
| --- | --- |
| `isPriceStateObject` | 3 |
| `parseSignaledValidUntil` | 5 |
| `earliestValidUntil` | 7 |
| `lowerStoredNumber` | 2 |
| `applySearchCacheCap` | 4 |
| `Query.product` | 3 |
| `Query.allProducts` | 2 |
| `Query.products` | 2 |
| `StoreSearchResult.suggestions` | 2 |
| `StoreSearchResult.products` | 1 |

Antes do split, `earliestValidUntil` estava em 11. Os resolvers só receberam a chamada; nenhum ganhou ramo.

| Cheiro | Onde | Lente | Desfecho |
| --- | --- | --- | --- |
| A baixa de `sMaxAge` e de `staleWhileRevalidate` repetia a mesma regra: só desce um número já gravado, até `min(atual, teto, segundos)` | `packages/api/src/platforms/vtex/utils/searchCacheCap.ts` (`lowerStoredNumber`) | DRY | Ajustado em `b58c8318f03b39f12001c0b92bbf032da215c8a3` |
| `earliestValidUntil` decidia se a oferta entra e ainda escolhia o mínimo. CC estimada 11 | `searchCacheCap.ts` (`parseSignaledValidUntil`) | complexidade | Ajustado em `0577d0564aee97639710a3f161ef99a3a0b1416b` |
| `headers` entra na assinatura e a função não lê o campo | `applySearchCacheCap` | pureza | Aceito |

### Avisos

`headers` não é lido — `{ cacheControl? }` sozinho é tipo fraco e o TypeScript recusa `GraphqlContext`; o plano proíbe declarar `cacheControl` no contexto, e `headers` é a propriedade em comum que libera a passagem — vale rever se `GraphqlContext` passar a declarar `cacheControl`.

### Sugestões

- `packages/api/src/platforms/vtex/resolvers/searchResult.ts`: `suggestions` e `products` repetem o mesmo mapa `pickBestSku` + `enhanceSku`. As duas cópias já existiam antes do cap. Cabem num helper privado do arquivo quando alguém mexer nessa escolha de SKU.
- `packages/api/src/directives/cacheControl.ts`: `min` parece a mesma conta e devolve o outro número quando um lado falta. Reutilizá-la no cap criaria um número onde o hint tem de continuar ausente. A regra ficou em `lowerStoredNumber`.
- `AGENTS.md` should gain a cyclomatic complexity ceiling. `biome.json` não define teto; esta revisão usou 10.

Os mesmos testes passaram depois dos ajustes: 2 arquivos, 30 testes; `pnpm --filter @faststore/api test:unit`, 34 arquivos, 468 testes.

## Review

> **Verdict**: Approve
> **Date**: 2026-11-26
> **Commit reviewed**: `4245a9c04b3b72ca456c2565a6d4ec2570149f2a`

Achados bloqueantes: 0. Advisory: 0.

| # | Check | Onde | Contrato | Achado | Severidade |
| --- | --- | --- | --- | --- | --- |

O diff `feat/cart-price-state...4245a9c04` fecha os quatro checks.

Os passos 1 e 2 estão em `b09c2234290b08f1adb1c83cff26a69bb37deacc` e `da6bf0a3df57464d33363feb0939b45da55b4e1c`. `b58c8318f` e `0577d0564` só separam a baixa do par e o parse da oferta sinalizada. `sMaxAge` e `staleWhileRevalidate` continuam `min(atual, min(teto, segundos))` quando o atual é número. `scope` não é escrito. As rulings ficam de pé: `Date.parse` com `NaN` de fora, objeto não nulo e não array como sinal, `headers?` só para o TypeScript aceitar `GraphqlContext`, `facets` e `searchId` fora do cap, fase empilhada sem esperar merge.

Os testes novos assertam o par gravado (300/3600, 120/120, 300/1000, 0/0) e o `itemId` que `pickBestSku` escolhe. Nenhum está skipped. Nenhum esperado sai da função sob teste. O `readFileSync` do passo 2 falha se `applySearchCacheCap` entrar no loader, no `validateCart` ou no cliente, ou se `reasonKey` deixar de ser `String`. Nenhum teste antigo foi afrouxado.

ADR-0003: sem objeto cru o hint fica 300 e 3600; com objeto, a fórmula do `min`; data ilegível fica de fora; data no passado zera os dois; `resolvePriceState()` sem origem não é lido; `discovery.config` não entra; `validateCart` e `skuLoader` não chamam o cap; o cliente não manda `Cache-Control`. ADR-0001: `reasonKey` em `offer.graphql` segue `String`. O diff não cria enum, `priceAffectingParams` nem `customData`.

C1–C5 estão no código e nos testes do Walkthrough. Reexecução nesta review, em 2026-11-26. O `pnpm` desta máquina só chega no Vitest com `npm_config_manage_package_manager_versions=false`; sem isso o binário `pnpm@10.28.0` não está no store e o comando morre antes dos testes. Os números abaixo são dessa invocação:

- `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/searchCacheCap.test.ts test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` — pass, 2 arquivos, 30 testes (19 + 11)
- `pnpm --filter @faststore/api test:unit` — pass, 34 arquivos, 468 testes

## Walkthrough

1. Em `packages/api/test/unit/platforms/vtex/utils/searchCacheCap.test.ts`, o teste `keeps 300 and 3600 when no offer has a priceState object` preenche `PriceValidUntil` e omite `priceState`. O hint que volta é 300 e 3600. Comando: `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/searchCacheCap.test.ts`. (C1)
2. No mesmo arquivo, data a 7200 segundos deixa 300 e 3600; data a 1000 segundos deixa `sMaxAge` 300 e `staleWhileRevalidate` 1000; data a 120 segundos deixa 120 e 120; data no passado ao lado de data futura, e restante de 999 ms, deixam 0 e 0. (C2)
3. No mesmo arquivo, `not-a-date` sozinha deixa 300 e 3600; `null`, array e primitivo também; `{}` e `{ available: true, reasonKey: null }` na origem baixam o par. `applySearchCacheCap` não importa `resolvePriceState`. O default do BFF, em `packages/api/src/platforms/vtex/resolvers/offer.ts`, continua sem a oferta e não entra no cap. (C3)
4. `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts`. `Query.product` com o objeto em `isVariantOf.items`, o fallback de slug, `allProducts`, `products`, `StoreSearchResult.products` (o SKU escolhido é `chosen` e o irmão encurta) e `suggestions` com query baixam para 120 e 120. `suggestions` sem query, `Query.search`, `facets`, `metadata` e `searchId` ficam em 300 e 3600, com `scope` `public`. O teste de `scope` `private` está no arquivo do passo 1: o par desce e o scope permanece. (C4)
5. O último teste desse arquivo lê `typeDefs/offer.graphql` (`reasonKey: String`), confirma que `clients/search/index.ts` não contém `Cache-Control` nem `s-maxage`, e que `loaders/sku.ts`, `resolvers/validateCart.ts` e o cliente não chamam `applySearchCacheCap`. O header da resposta segue `getSuccessCacheControl` em `packages/core/src/pages/api/graphql.ts`: com hint, devolve o `stringify` desse hint. Este checkout não sobe uma loja com `priceState` cru na Intelligent Search, então o header ao vivo não foi visto. (C5)
6. `pnpm --filter @faststore/api test:unit` — 34 arquivos, 468 testes, todos passando. Inclui o `query.test.ts` do passo 2, que o cap não pode quebrar quando `isVariantOf.items` falta.

`headers?` não é lido. Está na assinatura porque `{ cacheControl? }` sozinho é tipo fraco e `GraphqlContext` não declara o campo. Se o contexto passar a declarar `cacheControl`, o parâmetro pode sair. Objeto vazio e `{ available: true, reasonKey: null }` na origem encurtam o cache. Só o objeto montado por `resolvePriceState()` sem origem fica de fora. `Date.parse` lê a string gravada. Data que o parse rejeita mantém 300 e 3600.
