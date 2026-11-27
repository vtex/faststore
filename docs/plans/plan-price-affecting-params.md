# Query generalista e validateCart

> **Status**: PR open
> **Roadmap**: preco-minicart-e-vitrine #3
> **Branch**: preco-minicart-e-vitrine/p3-price-affecting-params
> **PR**: https://github.com/vtex/faststore/pull/3614
> **Last updated**: 2026-11-27

## Goal

`product`, `search` e `validateCart` passam a aceitar a string opcional `priceAffectingParams`, a busca copia esse texto para a URL da Intelligent Search, e cada oferta da resposta devolve a mesma string em `priceState`.

## Success Criteria

| # | Criterion | Traces to |
|---|---|---|
| C1 | `product`, `search` e `validateCart` aceitam `priceAffectingParams: String`, opcional. Ausente, `null` e `""` não seguem. `quantity` e `paymentMethod` não viram argumento. `allProducts` e `products` não ganham o argumento | Roadmap fase 3 In e Out; ADR-0004 Decision; TDD Interfaces |
| C2 | Com string não vazia, a URL v1 `product-search` da busca comum e a URL v1 `products` do produto, do fallback de slug e do cross-selling levam o query param `priceAffectingParams` com o texto copiado. O BFF não faz parse e não reordena chaves. `{}` e outra ordem de chaves seguem como vieram. `facets`, `search-suggestions`, `top-searches`, `catalog-count` e `pickup-point-availability` ficam sem o param | ADR-0004 Decision; TDD `Key Flows > Consulta com a string` |
| C3 | Cada oferta da resposta de `product` ou de `search` devolve a mesma string em `priceState.priceAffectingParams`. Sem string, o campo GraphQL é nulo. O BFF não inventa texto. `reasonKey` em `offer.graphql` permanece `String`. O schema não ganha `priceVariations` | ADR-0004 Decision; ADR-0001 Decision; TDD Data Model; roadmap fase 3 Out |
| C4 | `validateCart` aceita a string, segue sem `@cacheControl`, não escreve `ctx.cacheControl` e devolve a string em cada linha quando devolve carrinho. Sem string, o campo da linha é nulo. A mutation não grava a string no orderForm, não cria `customData` e a hidratação do carrinho não leva o param. `setOrderFormEtag` continua gravando só `cartEtag` | ADR-0004 Decision; TDD `Key Flows > Carrinho`; roadmap fase 3 In; Plan Check pre-decisions |
| C5 | Os documentos nativos de `product` e de `search` em `@faststore/core` não declaram a variável e não enviam a string. `ValidateCartMutation`, `useOffer` e o `getStaticProps` da PDP permanecem sem a string. O documento que envia a string declara `$priceAffectingParams: String` e só inclui o valor quando ele existe | ADR-0004 Decision; TDD `Key Flows > Consulta com a string` e `Fora do argumento` |
| C6 | O cap da fase 2 continua ligado só pelo objeto cru `priceState` da oferta comercial. O argumento novo não liga nem desliga o cap. `applySearchCacheCap` permanece com a assinatura atual | ADR-0003 Decision; roadmap fase 3 Out; TDD Cross-Cutting Concerns |

## Recon

| Area | Finding |
|---|---|
| `packages/api/src/platforms/vtex/typeDefs/query.graphql` | `product` (217–223) recebe só `locator`. `search` (239–265) recebe `first`, `after`, `sort`, `term`, `selectedFacets` e `sponsoredCount`. Os dois declaram `@cacheControl(scope: "public", sMaxAge: 300, staleWhileRevalidate: 3600)`. `allProducts` (270) e `products` (285) não têm argumento de preço |
| `packages/api/src/platforms/vtex/typeDefs/mutation.graphql` | `validateCart(cart: IStoreCart!, session: IStoreSession)` (5) não declara `@cacheControl` |
| `packages/api/src/platforms/vtex/typeDefs/offer.graphql` | `StoreOfferPriceState` (72–81) tem `available: Boolean!` e `reasonKey: String`. Não há `priceAffectingParams` nem `priceVariations` |
| `packages/api/src/__generated__/schema.ts` | `QueryProductArgs` (1044) é só `locator`. `QuerySearchArgs` (1077) não tem a string. `MutationValidateCartArgs` (747) é `cart` e `session`. `StoreOfferPriceState` (1693) para em `reasonKey`. O arquivo sai de `pnpm --filter @faststore/api generate` (`packages/api/codegen.yml`) |
| `packages/api/src/platforms/vtex/utils/priceState.ts` | `resolvePriceState()` sem origem devolve `{ available: true, reasonKey: null }` (11–24) |
| `packages/api/src/platforms/vtex/resolvers/offer.ts` | `priceState` (81) chama `resolvePriceState()` sem a oferta. A raiz de busca é a oferta comercial com `product`; a raiz de carrinho é o item do orderForm com `skuName` (26–30) |
| `packages/api/src/platforms/vtex/resolvers/query.ts` | `Query.product` (187–241) carrega o SKU pelo `skuLoader` e, no fallback, por `fetchProduct`. O cap roda em `sku.isVariantOf?.items` (239). `Query.search` (261–345) monta `searchArgs` sem preço e devolve `productSearchPromise`: `search.products` no caminho comum (342) e `productsByIdentifier` no cross-selling (313). `allProducts` (346) e `products` (387) chamam o cap e não recebem a string. `Query.search` não chama o cap |
| `packages/api/src/platforms/vtex/resolvers/searchResult.ts` | `products` (70–101) e `suggestions` com query (42–68) aguardam `productSearchPromise`, chamam o cap e montam o SKU com `enhanceSku`. Sem `searchArgs.query`, `suggestions` (29–38) devolve `products: []` via `topSearches`. `facets` (102) chama `is.facets(searchArgs)`. `metadata` (131) e `searchId` (140) só leem a promise |
| `packages/api/src/platforms/vtex/utils/searchCacheCap.ts` | `isPriceStateObject` (14–15) liga o cap em objeto não nulo e não array. `applySearchCacheCap` (78–82) lê `commertialOffer.priceState` e `PriceValidUntil`. Sem hint, retorna sem criar política |
| `packages/api/src/platforms/vtex/utils/intelligentSearchRequest.ts` | `buildIntelligentSearchRequest` (677) manda `product-search` e `facets` por `buildSearchLikeParams` (466) e `products` por `buildProductsParams` (550). `""` já fica de fora nos `set` de outros params (633–636). Nenhum endpoint recebe `priceAffectingParams` |
| `packages/api/src/platforms/vtex/clients/search/index.ts` | `products` (192) usa o endpoint `product-search`. `fetchProduct` (195) e `productsByIdentifier` (219) usam o endpoint `products`. A URL é `/api/intelligent-search/v1/${endpoint}`. `SearchArgs` (37) e `FetchProductArgs` (57) não têm a string |
| `packages/api/src/platforms/vtex/loaders/sku.ts` | A chave é `skuId` ou `skuId-invisibleItems` e o loader parte em `split('-')` (11–14). Chama `productsByIdentifier` com `field: 'sku'` (16–24). `validateCart` usa o mesmo loader. Com `flags.enableUnavailableItemsOnCart`, manda `hideUnavailableItems: false` |
| `packages/api/src/platforms/vtex/resolvers/validateCart.ts` | `orderFormToCart` (378) monta cada linha com o item do orderForm e o SKU do loader. `setOrderFormEtag` (435–446) grava só `appId: 'faststore'` e `key: 'cartEtag'`. `validateCart` (783) não lê string de preço e não escreve `ctx.cacheControl`. Carrinho válido devolve `null` (o teste de `ValidCart` em `mutations.test.ts`) |
| `packages/api/src/platforms/vtex/utils/enhanceSku.ts` | `EnhancedSku` é `Item & { isVariantOf: Product }` (5). Não carrega texto de preço |
| `packages/core/src/sdk/graphql/request.ts` | `GETRequest` (53–65) coloca `variables: JSON.stringify(variables)` na query string. `POSTRequest` (77) manda as variáveis no corpo |
| `packages/core/src/pages/api/graphql.ts` | `getSuccessCacheControl` (307–326) usa o hint quando ele existe. Sem hint, POST responde `no-cache, no-store` |
| `packages/core/@generated/cached-operations.json` | `ServerProductQuery`, `ClientProductQuery`, `ClientProductGalleryQuery`, `ClientManyProductsQuery`, `ServerManyProductsQuery` e as queries de sugestão estão na lista GET. `ValidateCartMutation` não está |
| `packages/core/src/sdk/product/useProductQuery.ts` | `ClientProductQuery($locator)` chama `product(locator: $locator)` (15–21) |
| `packages/core/src/pages/[slug]/p.tsx` | `ServerProductQuery($locator)` (351) e `getStaticProps` (441–449) mandam só `locator` com `slug`, `channel` e `locale` |
| `packages/core/src/sdk/product/useAllVariantProducts.ts` | `ClientAllVariantProductsQuery($locator)` chama `product(locator: $locator)` (12–16) |
| `packages/core/src/customizations/src/fragments/ClientProduct.ts` | Fragmento `product(locator: $locator)` (5) |
| `packages/core/src/customizations/src/fragments/ServerProduct.ts` | Fragmento `product(locator: $locator)` (5) |
| `packages/core/src/sdk/product/useProductGalleryQuery.ts` | `ClientProductGalleryQuery` chama `search` com `first`, `after`, `sort`, `term` e `selectedFacets` (21–52) |
| `packages/core/src/utils/fetchProductGallerySSR.ts` | `ServerManyProductsQuery` chama `search` com esses campos e `sponsoredCount` (11–28). A PLP em `pages/[...slug].tsx` usa esse documento |
| `packages/core/src/sdk/product/useProductsQuery.ts` | `ClientManyProductsQuery` chama `search` (11–38) |
| `packages/core/src/sdk/product/useProductsPrefetch.ts` | Repete `ClientManyProductsQuery` sem a variável nova (12–28) |
| `packages/core/src/sdk/product/usePageProductsQuery.ts` | `ClientManyProductsQueryWithSearchId` chama `search` (37) |
| `packages/core/src/sdk/search/useSuggestions.ts` | `ClientSearchSuggestionsQuery` chama `search(first: 5, term: $term, selectedFacets: $selectedFacets)` (14–20) |
| `packages/core/src/sdk/search/useTopSearch.ts` | `ClientTopSearchSuggestionsQuery` usa a mesma forma de `search` (10–16) |
| `packages/core/src/customizations/src/fragments/ClientProductGallery.ts` | `search` sem a variável (5) |
| `packages/core/src/customizations/src/fragments/ClientManyProducts.ts` | `search` sem a variável (5) |
| `packages/core/src/customizations/src/fragments/ClientSearchSuggestions.ts` | `search(first: 5, ...)` (5) |
| `packages/core/src/customizations/src/fragments/ClientTopSearchSuggestions.ts` | `search(first: 5, ...)` (5) |
| `packages/core/src/sdk/product/useProductsSelected.tsx` | `ClientManyProductsSelectedQuery` chama `products(productIds:)` (11–17). Esse campo não recebe a string |
| `packages/core/src/sdk/product/index.ts` | `ClientProductCountQuery` chama `productCount` (9–14) |
| `packages/core/src/sdk/cart/index.ts` | `ValidateCartMutation($cart, $session)` (45–46) não declara a string. O fragmento `CartItem` pede `priceState { available reasonKey }` |
| `packages/core/src/sdk/offer/fetcher.ts` | `useOffer` monta `/api/intelligent-search/product_search` com `query=sku.id:` (7–13) e não passa pelo BFF |
| `packages/api/vitest.config.ts` | `globals: false` (5). Todo teste novo importa `describe`, `it` e `expect` de `vitest` |
| `packages/api/test/unit/platforms/vtex/utils/intelligentSearchRequest.test.ts` | Já cobre `buildIntelligentSearchRequest` e converte `URLSearchParams` com `paramsToObject` |
| `packages/api/test/unit/platforms/vtex/clients/search.test.ts` | Monta `IntelligentSearch` com `fetchAPI` mockado |
| `packages/api/test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` | Cobre o cap em `Query.product`, `allProducts`, `products` e `StoreSearchResult`. Este plano não muda esse arquivo de produção |
| `packages/api/test/integration/mutations.test.ts` | `ValidCart` devolve `validateCart: null`. O carrinho stale usa `checkoutOrderFormStaleFetch`, `checkoutOrderFormCustomDataStaleFetch`, `productSearchPage1Count1Fetch` e `salesChannelStaleFetch`, e devolve linhas. O `PUT` cai em `/customData/faststore/cartEtag` |
| `docs/knowledge/INDEX.md` | Ausente. Notas locais lidas: `queries-nativas-sem-quantity-payment.md`, `cache-graphql-e-estatico.md`, `bff-devolve-price-state-disponivel.md` |
| `docs/roadmaps/preco-minicart-e-vitrine/` | `carryover-phase-1.md` e `carryover-phase-2.md` não estão no disco. O Carry-over Log não traz fato que mude este contrato |

## Approach

`followPriceAffectingParams` devolve a própria string quando ela tem tamanho maior que zero. `null`, ausência e `""` devolvem `null`. A função não corta espaço, não chama `JSON.parse` e não ordena chaves. `buildIntelligentSearchRequest` grava o query param só nos endpoints `product-search` e `products`. `Query.product`, quando a string segue, não usa o `skuLoader`: a chave dele parte em `-` e o mesmo loader hidrata o carrinho, então o texto iria para a URL do carrinho ou quebraria o id. A busca comum manda a string para `search.products`. O cross-selling manda para `productsByIdentifier`. A string fica fora de `searchArgs`, e `facets` não a vê. O eco é um símbolo no SKU ou na linha do carrinho, lido por `StoreOffer.priceState`. Um campo no contexto vazaria o texto para `allProducts` na mesma operação. `resolvePriceState()` segue sem origem. O símbolo não entra em `commertialOffer.priceState`, e o cap não recebe o argumento.

## Steps

A fase 3 está empilhada em `preco-minicart-e-vitrine/p2-ttl-price-valid-until` (`dev ← feat/cart-price-state ← preco-minicart-e-vitrine/p2-ttl-price-valid-until ← preco-minicart-e-vitrine/p3-price-affecting-params`). A implementação segue nesta stack. Os passos abaixo são o ledger.

- [x] **1. Portão e schema** — criar `followPriceAffectingParams` em `packages/api/src/platforms/vtex/utils/priceAffectingParams.ts`. Assinatura: `(value: string | null | undefined) => string | null`. String com `length > 0` volta igual, inclusive `'  '` e `'{}'`. `undefined`, `null` e `""` voltam `null`. Sem `trim`, sem `JSON.parse`, sem ordenar chaves. Em `query.graphql`, acrescentar `priceAffectingParams: String` opcional em `product` (depois de `locator`) e em `search` (depois de `sponsoredCount`), com a descrição `Opaque client text for this query. Absent, null, and empty do not follow.` Não acrescentar o argumento em `allProducts`, `products`, `collection` nem `productCount`. Em `mutation.graphql`, acrescentar o mesmo argumento opcional em `validateCart`, depois de `session`, sem `@cacheControl`. Em `offer.graphql`, acrescentar `priceAffectingParams: String` em `StoreOfferPriceState`, depois de `reasonKey`, com a descrição `The client text copied for this response. Null when this response had no string.` `reasonKey` permanece `String`. Não acrescentar `priceVariations`, `quantity` nem `paymentMethod`. Não editar `IStoreOffer` nem `IStoreCart`. Rodar `pnpm --filter @faststore/api generate` e commitar o `packages/api/src/__generated__/schema.ts` que o comando escrever. Não editar esse arquivo à mão. Não rodar o codegen de `@faststore/core` e não editar `packages/core/@generated/`. Testes em `packages/api/test/unit/platforms/vtex/utils/priceAffectingParams.test.ts`, com import de `vitest`: a função nos casos acima; `{"b":1,"a":2}` volta idêntico e diferente de `{"a":2,"b":1}`; leitura de `schema.ts` mostra o argumento opcional em `QueryProductArgs`, `QuerySearchArgs` e `MutationValidateCartArgs`, e `priceAffectingParams` em `StoreOfferPriceState`; `offer.graphql` ainda tem `reasonKey: String` e não tem `priceVariations`.
  **Verify:** `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/priceAffectingParams.test.ts`
  **Commit:** f117e6131b8317048ca2ded7dd35605f81f2117f
- [x] **2. Query param na URL** — em `IntelligentSearchRequestArgs`, `SearchArgs`, `FetchProductArgs` e `ProductsByIdentifierArgs`, acrescentar `priceAffectingParams?: string | null`. Em `buildIntelligentSearchRequest`, depois de montar os params de `product-search` e de `products`, se `followPriceAffectingParams(args.priceAffectingParams)` devolver string, fazer `params.append('priceAffectingParams', texto)`. Não acrescentar no `case` de `facets`, `catalog-count`, `search-suggestions`, `top-searches` nem `pickup-point-availability`, mesmo com o campo presente em `args`. Não colocar o append dentro de `buildSearchLikeParams`, porque `facets` e `catalog-count` usam essa função. `products()` e `fetchProduct` repassam o campo ao builder. `productsByIdentifier` repassa o mesmo campo a cada `fetchProduct`. Testes novos em `intelligentSearchRequest.test.ts`: `product-search` e `products` devolvem `params.get('priceAffectingParams')` igual a `{"b":1,"a":2}`, a `{}`, a `'  '` e a `{"q":"a&b=c"}`; `{"a":2,"b":1}` é outro valor; `""`, `null` e campo ausente não criam a chave; `facets`, `catalog-count`, `search-suggestions`, `top-searches` e `pickup-point-availability` com o mesmo texto não criam a chave. Testes novos em `search.test.ts`: a URL de `products` contém `/product-search/` e o param; a URL de `fetchProduct` contém `/products?` e o param; `facets` com o campo no args não contém `priceAffectingParams`.
  **Verify:** `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/intelligentSearchRequest.test.ts test/unit/platforms/vtex/clients/search.test.ts`
  **Commit:** a3365e014c05afff7bc5d286fda9d53b7d3ae7e8
- [x] **3. Eco e resolvers de produto e busca** — no mesmo módulo do passo 1, exportar um símbolo e `stampPriceAffectingParams(value, params)`. Com `params` nulo, devolve o mesmo objeto. Com string, devolve cópia rasa com o símbolo. `readPriceAffectingParamsStamp` lê o símbolo e passa o valor por `followPriceAffectingParams`. Em `offer.ts`, `priceState` continua chamando `resolvePriceState()` sem origem e acrescenta `priceAffectingParams: readPriceAffectingParamsStamp(...)`. Na oferta de busca, o símbolo está em `root.product`. Na linha do carrinho, está na própria raiz. Sem símbolo, o campo é `null`. Não ler `commertialOffer.priceState` para preencher esse campo. Não gravar o símbolo dentro de `commertialOffer.priceState`. Em `Query.product`, ler o argumento e calcular `followed`. Sem string, o caminho segue `skuLoader.load` e o fallback `fetchProduct` como hoje, e o retorno passa por `stampPriceAffectingParams(sku, null)`. Com string, não chamar `skuLoader`: chamar `ctx.clients.search.productsByIdentifier` com `field: 'sku'`, `values: [skuId]`, `throwOnUpstreamError: true`, `priceAffectingParams: followed` e, quando `ctx.storage.flags.enableUnavailableItemsOnCart` for verdadeiro, `hideUnavailableItems: false`. Achar o item cujo `itemId` é o sku e devolver `enhanceSku`. SKU ausente lança `NotFoundError` para o fallback atual. `fetchProductBySlugFallback` recebe `followed` e o repassa a `fetchProduct` só quando a string existe. O cap permanece `applySearchCacheCap(ctx, sku.isVariantOf?.items)`, sem terceiro argumento de texto. Em `Query.search`, não colocar a string em `searchArgs`. No caminho comum, passar `priceAffectingParams: followed` só para `search.products`. No cross-selling, passar só para `productsByIdentifier`. O objeto devolvido ganha `priceAffectingParams: followed`, com `followed` nulo quando a string não segue. `StoreSearchResult.products` e o ramo de `suggestions` que monta SKU chamam `stampPriceAffectingParams` em cada SKU com esse valor. `facets`, `suggestedTerms`, `topSearches`, `metadata` e `searchId` não recebem o campo. `allProducts` e `Query.products` não leem o argumento e não carimbam. Não editar `searchCacheCap.ts`. Testes em `packages/api/test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts`, com import de `vitest`: `StoreOffer.priceState` devolve a string carimbada no SKU e na linha, e devolve `null` sem carimbo mesmo quando `commertialOffer.priceState` é `{}`; `Query.product` com string chama `productsByIdentifier` com o texto e não chama `skuLoader`, e o fallback chama `fetchProduct` com o texto; sem string, chama `skuLoader` e o fallback sem o campo; `Query.search` comum chama `products` com o texto e `facets(searchArgs)` não vê o campo; cross-selling chama `productsByIdentifier` com o texto; `suggestions` e `products` devolvem o eco em cada oferta e `null` sem string; `allProducts` e `Query.products` chamam a busca sem o campo; com string e oferta sem objeto `priceState`, o hint fica 300 e 3600; sem string e com objeto cru, o cap ainda baixa o hint; `readFileSync` confirma que `loaders/sku.ts` não contém `priceAffectingParams`.
  **Verify:** `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts test/unit/platforms/vtex/resolvers/query.test.ts`
  **Commit:** 082fa9e0b88eb38fa4997cd30029d2dcc1bcee96
- [x] **4. validateCart e documentos nativos** — em `validateCart`, calcular `followed` uma vez. Passar `followed` a `orderFormToCart`, `cartWhenItemsUnchanged` e `cartWhenSalesChannelAdoptedOrNull`, e desses para as chamadas internas de `orderFormToCart`. Cada linha devolvida passa por `stampPriceAffectingParams`. `loadCartSku` e `productsByIdentifier` do carrinho ficam sem o campo. Não passar `followed` a `updateOrderFormItems`, `setCustomData` nem a outro write do checkout. `setOrderFormEtag` continua com `key: 'cartEtag'` e `appId: 'faststore'`. Não atribuir `ctx.cacheControl`. Carrinho que hoje devolve `null` continua devolvendo `null`. Não acrescentar o argumento em `IStoreOffer`. Não editar os documentos de `@faststore/core` listados no Recon, nem `packages/core/src/sdk/offer/fetcher.ts`, nem `packages/core/@generated/`. Teste de integração novo `packages/api/test/integration/vtex.validateCart.priceAffectingParams.test.ts`, com import de `vitest`, reusando o runner e os fetches de `test/integration/mutations.test.ts`. O documento que envia a string declara `$priceAffectingParams: String` e seleciona `priceState { available reasonKey priceAffectingParams }`. Com a string e o carrinho stale (`InvalidCart` mais `checkoutOrderFormStaleFetch`), cada `acceptedOffer` devolve essa string. Com a variável omitida num documento que não a declara, e com `null` e `""` num documento que declara, o campo volta `null`. Nenhuma URL de `mockedFetch` contém `priceAffectingParams`. O `PUT` de custom data continua em `/customData/faststore/cartEtag` e o corpo continua o etag da fixture, não o texto do cliente. `ValidCart` com a string continua `validateCart: null`. Não alterar o documento nem o snapshot de `test/mocks/ValidateCartMutation.ts`. No arquivo `test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts`, `readFileSync` confirma: `mutation.graphql` não tem `@cacheControl` em `validateCart`; `validateCart.ts` não contém `cacheControl`; `setOrderFormEtag` ainda contém `key: 'cartEtag'`; `offer.graphql` ainda tem `reasonKey: String` e não tem `priceVariations`; `cached-operations.json` não contém `ValidateCartMutation`; `fetcher.ts` ainda aponta para `product_search` com `sku.id` e não contém `priceAffectingParams`; cada documento nativo do Recon (`useProductQuery.ts`, `p.tsx`, `useAllVariantProducts.ts`, `ClientProduct.ts`, `ServerProduct.ts`, `useProductGalleryQuery.ts`, `fetchProductGallerySSR.ts`, `useProductsQuery.ts`, `useProductsPrefetch.ts`, `usePageProductsQuery.ts`, `useSuggestions.ts`, `useTopSearch.ts`, `ClientProductGallery.ts`, `ClientManyProducts.ts`, `ClientSearchSuggestions.ts`, `ClientTopSearchSuggestions.ts`, `useProductsSelected.tsx`, `packages/core/src/sdk/product/index.ts`, `packages/core/src/sdk/cart/index.ts`) não contém `priceAffectingParams`. Os caminhos de `@faststore/core` partem da raiz do repositório: `packages/api` está um nível abaixo, e o `source()` de `searchCacheCap.test.ts` aponta para `packages/api`.
  **Verify:** `pnpm --filter @faststore/api exec vitest run test/integration/vtex.validateCart.priceAffectingParams.test.ts test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts`
  **Commit:** d6c662156338230053fc432ef9fa16af84c54b83

## Verification

- **C1** — `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/priceAffectingParams.test.ts` lê o schema gerado e cobre ausente, `null`, `""` e string que segue — pass 2026-11-27, 1 file, 5 tests
- **C2** — `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/intelligentSearchRequest.test.ts test/unit/platforms/vtex/clients/search.test.ts test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts` cobre o param em `product-search` e `products`, a ordem das chaves, e a ausência do param em `facets` e nas chamadas sem string — pass 2026-11-27, 3 files, 64 tests
- **C3** — `test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts` cobre o eco em cada oferta de `product` e de `search`, o nulo sem string, `reasonKey: String` e a ausência de `priceVariations` — pass 2026-11-27, 13 tests in that file, included in the C2 run
- **C4** — `pnpm --filter @faststore/api exec vitest run test/integration/vtex.validateCart.priceAffectingParams.test.ts` cobre o eco da linha, o `null`, o `PUT` só de `cartEtag` e a URL do carrinho sem o param — pass 2026-11-27, 1 file, 3 tests
- **C5** — o `readFileSync` do passo 4 cobre os documentos nativos, `useOffer`, o `getStaticProps` em `p.tsx` e a mutation do carrinho — pass 2026-11-27, included in the 13-test resolver file
- **C6** — `test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts` e `test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` cobrem o cap com string e sem objeto, e sem string e com objeto — pass 2026-11-27, 2 files, 24 tests
- **Suite** — `pnpm --filter @faststore/api test:unit` — pass 2026-11-27, 36 files, 493 tests

## Risks & Open Questions

O diff desta camada inclui as fases 1 e 2 até `feat/cart-price-state` e `preco-minicart-e-vitrine/p2-ttl-price-valid-until` entrarem em `dev`. A implementação segue nesta stack. O PR 3592 continua aberto.

O teto de 10 minutos do Janus continua fora deste repositório. A pergunta aberta do roadmap sobre quem configura esse teto não bloqueia esta fase.

O nome do campo no orderForm continua sem escolha. Esta fase não grava nesse campo e não cria `customData`. A lista de membros de `reasonKey` continua aberta. O campo publicado segue `String`.

`carryover-phase-1.md` e `carryover-phase-2.md` não estão no disco. Os fatos usados saíram do Carry-over Log do roadmap.

Open Questions: nenhuma.

## Rulings

- `flags` ausente conta como falso — `ctx.storage.flags?.enableUnavailableItemsOnCart` segue o loader do SKU — um storage sem a flag não manda `hideUnavailableItems: false`, e a flag verdadeira continua mandando.
- O PUT stale grava o md5 que `getOrderFormEtag` calcula dos itens de `checkoutOrderFormStaleFetch`, não o `init.body` antigo `78044bf…` — esse corpo gravado já não bate com o algoritmo atual e o snapshot não o confere — o texto do cliente continua fora do corpo.
- O runner do teste de integração foi copiado de `mutations.test.ts` — importar aquele arquivo registraria a suíte outra vez — o mock e os fetches são os mesmos.



| Doc | Type | Why it matters here |
|---|---|---|
| [adr-0004](../adrs/adr-0004-string-price-affecting-params.md) | Binding (ADR) | String opcional, cópia sem leitura, eco, carrinho sem `customData`, queries nativas e o que fica de fora |
| [adr-0001](../adrs/adr-0001-contrato-do-price-state.md) | Binding (ADR) | `reasonKey` publicado segue `String`. Esta fase não cria `priceVariations` nem membros de enum |
| [adr-0003](../adrs/adr-0003-ttl-cdn-so-com-price-state-da-origem.md) | Binding (ADR) | O cap lê o objeto cru. O argumento novo não liga o cap. `validateCart` não grava hint |
| [tdd-price-affecting-params](../tdds/tdd-price-affecting-params.md) | Binding (phase design) | Onde a string entra, o que volta em `priceState`, e o que o carrinho não grava |
| [sessão](../brainstorms/preco-externo-storefront/session.md) | Reference | `Threads > Plano generalista` e `Threads > Volta do parâmetro` |
| [queries-nativas-sem-quantity-payment](../brainstorms/preco-externo-storefront/knowledge/queries-nativas-sem-quantity-payment.md) | Reference | `product` e `search` hoje não têm `quantity` nem `paymentMethod` |
| [cache-graphql-e-estatico](../brainstorms/preco-externo-storefront/knowledge/cache-graphql-e-estatico.md) | Reference | O GET leva `variables` e o hint da diretiva |
| [bff-devolve-price-state-disponivel](../brainstorms/preco-externo-storefront/knowledge/bff-devolve-price-state-disponivel.md) | Reference | `resolvePriceState()` sem origem devolve o default e não inventa texto |
| [roadmap](../roadmaps/preco-minicart-e-vitrine/roadmap.md) | Roadmap (Phase #3) | Branch `preco-minicart-e-vitrine/p3-price-affecting-params`, empilhada em `preco-minicart-e-vitrine/p2-ttl-price-valid-until` |

## Smell Review

O código revisto termina em `6641599b601cf3e1afadc17bcdffec6ceae7fc18`. O commit que só grava esta seção fica de fora. O plano permanece Built.

Complexidade ciclomática estimada à mão: o Biome não mede esse número e `lizard` não está instalado. A conta parte de 1 e soma `if`, `for`, `catch`, `&&`, `||`, `??` e ternário. `?.` fica de fora. O teto é 10.

| Função | CC estimada |
| --- | --- |
| `followPriceAffectingParams` | 3 |
| `stampPriceAffectingParams` | 2 |
| `readPriceAffectingParamsStamp` | 4 |
| `appendPriceAffectingParams` | 2 |
| `buildIntelligentSearchRequest` | 7 |
| `fetchSkuForPriceAffectingParams` | 4 |
| `fetchProductBySlugFallback` | 6 |
| `Query.product` | 9 |
| `Query.search` | 10 |
| `searchResultSku` | 2 |
| `StoreSearchResult.suggestions` | 2 |
| `StoreSearchResult.products` | 1 |
| `StoreOffer.priceState` | 3 |
| `fetchProduct` | 1 |
| `productsByIdentifier` | 4 |
| `orderFormToCart` | 3 |
| `cartWhenSalesChannelAdoptedOrNull` | 2 |
| `cartWhenItemsUnchanged` | 3 |
| `validateCart` | 18 |

Antes do extract, `buildIntelligentSearchRequest` estava em 9: o `if (text !== null)` existia no `product-search` e de novo no `products`. `suggestions` estava em 3 e `products` em 2, cada um com o `&&` do carimbo.

| Cheiro | Onde | Lente | Desfecho |
| --- | --- | --- | --- |
| A cópia da string para a URL estava escrita duas vezes, uma no `product-search` e outra no `products`. `facets` continua no mesmo `case` e não chama o helper | `packages/api/src/platforms/vtex/utils/intelligentSearchRequest.ts` (`appendPriceAffectingParams`) | DRY | Ajustado em `aed0aae310bfeebfaebb66024b1506a6de2d0c83` |
| `suggestions` e `products` escolhiam o SKU, montavam o produto e carimbavam a string com o mesmo bloco | `packages/api/src/platforms/vtex/resolvers/searchResult.ts` (`searchResultSku`) | DRY | Ajustado em `6641599b601cf3e1afadc17bcdffec6ceae7fc18` |
| `validateCart` está em 18 | `packages/api/src/platforms/vtex/resolvers/validateCart.ts` | complexidade | Aceito |

### Avisos

`validateCart` está em 18 — o algoritmo já decide canal, locale, mensagens, carrinho stale, frete, itens, marketing, locale do orderForm e etag — esta fase só atravessou a string até `orderFormToCart` — vale repartir quando esse algoritmo mudar.

### Sugestões

- `packages/api/src/platforms/vtex/loaders/sku.ts` e `fetchSkuForPriceAffectingParams` acham o item, chamam `enhanceSku` e lançam o mesmo `NotFoundError`. Uma função pura ao lado de `enhanceSku` serviria aos dois. O loader fica de fora deste diff: o teste da fase falha se `priceAffectingParams` aparecer em `loaders/sku.ts`.
- `packages/api/src/platforms/vtex/resolvers/searchResult.ts`: `suggestions` e `products` ainda chamam `applySearchCacheCap` com o mesmo `flatMap` dos itens. Essa cópia é anterior a esta fase. A entrada do cap muda com a regra de cache; o SKU apresentado muda com o carimbo. As duas ficam separadas.
- `AGENTS.md` should gain a cyclomatic complexity ceiling. `biome.json` não define teto; esta revisão usou 10.

Os mesmos testes passaram depois dos ajustes, em 2026-11-27. O `pnpm` desta máquina só chega no Vitest com `npm_config_manage_package_manager_versions=false`.

- C1 — `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/priceAffectingParams.test.ts` — pass, 1 arquivo, 5 testes
- C2 — `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/intelligentSearchRequest.test.ts test/unit/platforms/vtex/clients/search.test.ts test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts` — pass, 3 arquivos, 64 testes
- C4 — `pnpm --filter @faststore/api exec vitest run test/integration/vtex.validateCart.priceAffectingParams.test.ts` — pass, 1 arquivo, 3 testes
- C6 — `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` — pass, 2 arquivos, 24 testes
- Suíte — `pnpm --filter @faststore/api test:unit` — pass, 36 arquivos, 493 testes

A suíte antes dos ajustes foi a mesma: 36 arquivos, 493 testes. Depois do helper da URL, 2 arquivos, 51 testes. Depois de `searchResultSku`, 3 arquivos, 63 testes.

## Review

> **Verdict**: Approve
> **Date**: 2026-11-27
> **Commit reviewed**: `6065d6b2946cacb52d1fd6f1ff7aedccc316a721`

Achados bloqueantes: 0. Advisory: 0.

| # | Check | Onde | Contrato | Achado | Severidade |
| --- | --- | --- | --- | --- | --- |

O diff `preco-minicart-e-vitrine/p2-ttl-price-valid-until...6065d6b294` fecha os quatro checks.

Os passos 1 a 4 estão em `f117e6131b8317048ca2ded7dd35605f81f2117f`, `a3365e014c05afff7bc5d286fda9d53b7d3ae7e8`, `082fa9e0b88eb38fa4997cd30029d2dcc1bcee96` e `d6c662156338230053fc432ef9fa16af84c54b83`. `aed0aae310bfeebfaebb66024b1506a6de2d0c83` extrai `appendPriceAffectingParams` e segue chamando só nos endpoints `product-search` e `products`. `6641599b601cf3e1afadc17bcdffec6ceae7fc18` move o mesmo `pickBestSku`, `enhanceSku` e carimbo para `searchResultSku`. Os dois commits mudam estrutura. O comportamento fica o mesmo. As rulings ficam de pé: `ctx.storage.flags?.enableUnavailableItemsOnCart` trata flag ausente como falso; o PUT stale grava o md5 que o teste recalcula dos itens de `checkoutOrderFormStaleFetch`; o runner de integração é cópia local e os fetches são os de `mutations.test.ts`. A stack continua em `preco-minicart-e-vitrine/p2-ttl-price-valid-until`.

Os testes novos conferem a string, o nulo, a URL e o corpo do etag. Nenhum está skipped. O etag esperado do carrinho stale é um md5 calculado no teste, com `id`, `quantity`, `seller` e `attachments`, sem chamar `getOrderFormEtag`. O `readFileSync` falha se a string entrar em `loaders/sku.ts`, nos documentos nativos de `@faststore/core`, em `fetcher.ts` ou em `cached-operations.json` como `ValidateCartMutation`, se `validateCart` ganhar `@cacheControl` ou `cacheControl`, ou se `offer.graphql` perder `reasonKey: String` ou ganhar `priceVariations`. `query.test.ts` permanece na suíte, com 39 testes.

ADR-0004: `product`, `search` e `validateCart` aceitam `priceAffectingParams: String` opcional. Ausente, `null` e `""` ficam de fora. O BFF copia o texto. `{"b":1,"a":2}` e `{"a":2,"b":1}` seguem como vieram. A URL v1 de `product-search` e de `products` leva o param. `facets`, `search-suggestions`, `top-searches`, `catalog-count` e `pickup-point-availability` ficam sem ele. Cada oferta de `product` e de `search` devolve a mesma string em `priceState.priceAffectingParams`. Sem string, o campo é nulo. `validateCart` devolve a string na linha, o `PUT` continua em `/customData/faststore/cartEtag` e o corpo é o etag. A hidratação do carrinho usa o `skuLoader`, sem o param. Os documentos nativos de produto e de busca não declaram a variável. `quantity` e `paymentMethod` não são argumento. `useOffer` continua em `product_search` com `sku.id`. ADR-0001: `reasonKey` em `offer.graphql` segue `String`. O diff não acrescenta `priceVariations` nem enum. ADR-0003: `applySearchCacheCap` permanece `(ctx, items, now?)`. Com string e sem objeto cru, o hint fica 300 e 3600. Sem string e com objeto cru, o par desce. `validateCart.ts` não atribui `ctx.cacheControl`.

C1–C6 estão no código e nos testes do Walkthrough. Reexecução nesta review, em 2026-11-27. O prefixo `npm_config_manage_package_manager_versions=false` não segura o pnpm 11.1.3: o comando ainda procura `pnpm@10.28.0` no store e morre com ENOENT. O `--filter` também dispara `verify-deps-before-run`, que chama `pnpm install` e cai no mesmo erro. Os números abaixo saíram de `pnpm --pm-on-fail=ignore --config.verify-deps-before-run=false --filter @faststore/api`:

- C1 — `exec vitest run test/unit/platforms/vtex/utils/priceAffectingParams.test.ts` — pass, 1 arquivo, 5 testes
- C2 — `exec vitest run test/unit/platforms/vtex/utils/intelligentSearchRequest.test.ts test/unit/platforms/vtex/clients/search.test.ts test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts` — pass, 3 arquivos, 64 testes (36 + 15 + 13)
- C4 — `exec vitest run test/integration/vtex.validateCart.priceAffectingParams.test.ts` — pass, 1 arquivo, 3 testes
- C6 — `exec vitest run test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` — pass, 2 arquivos, 24 testes (13 + 11)
- Suíte — `test:unit` — pass, 36 arquivos, 493 testes

## Walkthrough

1. Em `packages/api`, rode `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/priceAffectingParams.test.ts`. `'  '` e `'{}'` voltam iguais. `{"b":1,"a":2}` volta igual a si e diferente de `{"a":2,"b":1}`. `undefined`, `null` e `""` voltam `null`. O schema gerado tem o argumento opcional em `QueryProductArgs`, `QuerySearchArgs` e `MutationValidateCartArgs`, e `priceAffectingParams` em `StoreOfferPriceState`. `allProducts` e `products` em `query.graphql` continuam sem esse argumento. (C1)
2. Rode `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/utils/intelligentSearchRequest.test.ts test/unit/platforms/vtex/clients/search.test.ts`. Em `product-search` e `products`, `params.get('priceAffectingParams')` é `{"b":1,"a":2}`, `{}`, `'  '` e `{"q":"a&b=c"}`. `""`, `null` e campo ausente não criam a chave. `facets`, `catalog-count`, `search-suggestions`, `top-searches` e `pickup-point-availability` com o mesmo texto também não. A URL de `products` contém `/product-search/` e o param. A URL de `fetchProduct` contém `/products?` e o param. `productsByIdentifier` repete o param em cada pedido. `facets` com o campo no args não contém a chave. (C2)
3. Rode `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/resolvers/priceAffectingParams.test.ts`. `Query.product` com a string chama `productsByIdentifier` e não chama `skuLoader`. O fallback de slug chama `fetchProduct` com o texto. Cada oferta de `suggestions` e de `products` devolve a mesma string. Sem string, o campo é nulo, mesmo com `commertialOffer.priceState` igual a `{}`. `allProducts` e `Query.products` chamam a busca sem o campo e não carimbam. `offer.graphql` tem `reasonKey: String` e não tem `priceVariations`. `StoreOffer.priceState` chama `resolvePriceState()` sem origem e lê o carimbo no SKU ou na linha. (C3)
4. Rode `pnpm --filter @faststore/api exec vitest run test/integration/vtex.validateCart.priceAffectingParams.test.ts`. Com a string e o carrinho stale, cada `acceptedOffer.priceState.priceAffectingParams` é `{"b":1,"a":2}`. Com a variável omitida, com `null` e com `""`, o campo da linha é nulo. Nenhuma URL de `mockedFetch` contém `priceAffectingParams`. O `PUT` cai em `/customData/faststore/cartEtag` e o corpo é o md5 dos itens, sem o texto do cliente. `ValidCart` com a string continua `validateCart: null`. (C4)
5. No mesmo arquivo de resolver, o teste `keeps useOffer, the cart mutation cache list, and native queries free of the string` lê os documentos nativos do Recon, `packages/core/src/pages/[slug]/p.tsx`, `packages/core/src/sdk/offer/fetcher.ts` e `packages/core/src/sdk/cart/index.ts`. Nenhum contém `priceAffectingParams`. `fetcher.ts` ainda aponta para `product_search` com `sku.id`. `cached-operations.json` não contém `ValidateCartMutation`. O documento da integração que envia a string declara `$priceAffectingParams: String`. O documento que omite a variável não a declara. (C5)
6. No teste de `Query.product`, com a string e sem objeto `priceState` na oferta, o hint fica 300 e 3600. Sem a string e com o objeto cru, o hint fica 120 e 120. `applySearchCacheCap` em `searchCacheCap.ts` continua `(ctx, items, now?)`. `pnpm --filter @faststore/api exec vitest run test/unit/platforms/vtex/resolvers/searchCacheCap.test.ts` passa os 11 testes da fase 2. (C6)
7. `pnpm --filter @faststore/api test:unit` — 36 arquivos, 493 testes, todos passando. Inclui `query.test.ts`, 39 testes.

`flags` ausente não manda `hideUnavailableItems: false`. A flag verdadeira manda. O PUT stale grava o md5 calculado dos itens da fixture, não o `init.body` antigo. O texto do cliente fica fora desse corpo. O nome do campo no orderForm continua sem escolha. Esta fase não grava nesse campo.
