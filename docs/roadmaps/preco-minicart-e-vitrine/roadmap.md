# Preço externo na vitrine — Roadmap

> **Status**: Active
> **Last updated**: 2026-11-26

## Goal

A conta com a integração vê preço indisponível, brinde ou o parâmetro que ela mesma enviou. A conta com a feature desligada permanece no preço, no brinde e no TTL de hoje.

## Phases

| # | Phase | Depends on | Docs | Status | Jira |
|---|---|---|---|---|---|
| 1 | Frase do preço no minicart | — | done: [tdd](../../tdds/tdd-frase-preco-minicart.md), [adr-0001](../../adrs/adr-0001-contrato-do-price-state.md), [adr-0002](../../adrs/adr-0002-brinde-nao-e-preco-indisponivel.md) | PR open | |
| 2 | TTL da CDN quando o priceState vem | #1 | done: [tdd](../../tdds/tdd-ttl-cdn-price-state.md), [adr-0003](../../adrs/adr-0003-ttl-cdn-so-com-price-state-da-origem.md) | Built | |
| 3 | Query generalista e validateCart | #1, #2 | done: [tdd](../../tdds/tdd-price-affecting-params.md), [adr-0004](../../adrs/adr-0004-string-price-affecting-params.md) | Pending | |

### Phase 1 — Frase do preço no minicart

**Goal:** A linha mostra a frase quando o preço não está disponível.

**In:** `priceState` com `available`, `reasonKey` e `priceVariations`. `reasonKey` segue `String` enquanto a lista de membros não existe. O contrato alvo é enum. `priceVariations` é um objeto livre que a integração devolve para a tela. O BFF repassa e não lê as chaves. Sem o objeto, o campo GraphQL é nulo. Sem origem, `available` fica `true` e `reasonKey` nulo. Brinde é preço 0 com `available` verdadeiro. `available` falso não é brinde e entra com zero no total da linha. Nesta fase a tela usa só a frase.
**Out:** Checkout, no PR 1728, fora deste roadmap. Plano posterior de tela, fora deste roadmap: o que a tela faz com `priceVariations` e o desenho além da frase. Argumento da query (#3). TTL (#2). Total do pedido no Checkout, que continua o totalizer do PR 1728.

**Source:** [sessão](../../brainstorms/preco-externo-storefront/session.md) — `Threads > Contrato do priceState`.

**Docs:** `done`: [tdd](../../tdds/tdd-frase-preco-minicart.md), [adr-0001](../../adrs/adr-0001-contrato-do-price-state.md), [adr-0002](../../adrs/adr-0002-brinde-nao-e-preco-indisponivel.md). O PR aberto tem `reasonKey` como `String` e não tem `priceVariations`.

**Notes for the spec:** Texto que trate `available: false` como brinde está errado. `priceValidUntil` é `String`. O loop não inventa membros do enum e não troca `String` por enum.

### Phase 2 — TTL da CDN quando o priceState vem

**Goal:** O TTL da CDN só desce até a `priceValidUntil` quando a Intelligent Search mandou `priceState` naquela resposta, sem passar dos tetos de 300 e de 3600.

**In:** O sinal é o campo cru da origem, antes do default do BFF. Sem esse campo em nenhuma oferta, o TTL fica 300 e 3600. Com o campo, `s-maxage = min(300, segundos até a data mais cedo entre as ofertas que trouxeram o campo)` e `stale-while-revalidate = min(3600, esses segundos)`. Data distante deixa os tetos. Data no passado zera os dois. Data ilegível fica de fora da conta. O cap olha `product`, `search`, `allProducts`, `products` e `suggestions` quando a busca devolve ofertas.
**Out:** `discovery.config`. TTL do Janus, sem dono neste repositório (Open Questions). A query generalista (#3). O `priceState` preenchido pelo BFF não liga o cap.

**Source:** [sessão](../../brainstorms/preco-externo-storefront/session.md) — `Threads > Cache da fase 2`.

**Docs:** `done`: [tdd](../../tdds/tdd-ttl-cdn-price-state.md), [adr-0003](../../adrs/adr-0003-ttl-cdn-so-com-price-state-da-origem.md).

**Notes for the spec:** Empilhada em `feat/cart-price-state` com gh stack. Não espera o merge da fase 1. `priceValidUntil` já vem nas ofertas de hoje. Usar a data sem o `priceState` da origem encurtaria o cache de todas as lojas. O cap olha a busca. `validateCart` não entra aqui.

### Phase 3 — Query generalista e validateCart

**Goal:** A string opcional do cliente identifica o preço pedido nesta consulta.

**In:** `product`, `search` e `validateCart` aceitam `priceAffectingParams: String`, opcional. Ausente, `null` e `""` não seguem. Nas buscas, o BFF copia o texto para a URL do Intelligent Search e a CDN parte junto. A mesma string volta em `priceState`. `validateCart` aceita a string, segue POST e `no-store`, e devolve a string na linha. A gravação no orderForm espera o nome do campo. O loop não cria `customData`. A Kitco monta quantity e payment method nessa query. O que volta em `priceVariations` é critério dela.
**Out:** Campos nativos `quantity` e `paymentMethod`, que este roadmap não cria. `useOffer` e o HTML estático permanecem no código atual, sem fase. TTL (#2). Plano posterior de tela, fora deste roadmap.

**Source:** [sessão](../../brainstorms/preco-externo-storefront/session.md) — `Threads > Plano generalista`, `Threads > Volta do parâmetro`.

**Docs:** `done`: [tdd](../../tdds/tdd-price-affecting-params.md), [adr-0004](../../adrs/adr-0004-string-price-affecting-params.md).

**Notes for the spec:** Empilhada em `preco-minicart-e-vitrine/p2-ttl-price-valid-until` com gh stack. Não espera merge. #2 e #3 editam `packages/api/src/platforms/vtex/resolvers/query.ts`. A operação declara a variável. Sem essa declaração, a URL da CDN muda e o resolver não vê o valor. O cliente ordena as chaves. O BFF não ordena. A linha devolve a string recebida na mutation. A gravação no orderForm espera o nome do campo. O loop não cria `customData`.

## Dependency Graph

```mermaid
flowchart LR
    1[Phase 1] --> 2[Phase 2]
    2 --> 3[Phase 3]
```

## Streams

- **Critical path**: 3 phases (#1 → #2 → #3)
- **Max parallelism**: 1 (widest wave: uma fase)

| Stream | Phases, in order |
|---|---|
| A | #1. Checkout segue e não trava esta stack |
| B | #2 |
| C | #3 |

## Delivery

- **Trunk**: `dev`
- **PRs open as**: draft

Ruling: PRs novos saem como draft, que é o default do faseamento. Os PRs 3592 e 1728 já estão abertos e não são convertidos.

| Phase | Stream / stack | Branch | PR |
|---|---|---|---|
| #1 | A (bottom) | `feat/cart-price-state` | https://github.com/vtex/faststore/pull/3592 |
| #2 | B (bottom) | `preco-minicart-e-vitrine/p2-ttl-price-valid-until` | |
| #3 | C (bottom) | `preco-minicart-e-vitrine/p3-price-affecting-params` | |

## Plan Check

> **Verdict**: Pass — 2026-11-26, round 2, accepted by the user: yes

| # | Dimension | Where | Finding | Severity | Resolved |
|---|---|---|---|---|---|
| K1 | Graph | #2, #3 | As duas fases editam `resolvers/query.ts` | blocking | [x] |
| K2 | Boundary | #3 Goal | O goal juntava consulta e carrinho | blocking | [x] |
| K3 | Boundary | #1, #2, #3 Out | Dono do que ficou de fora sem nome | blocking | [x] |
| K4 | Coverage | #2 | O cap também olha `allProducts`, `products` e `suggestions` | blocking | [x] |
| K5 | Consistency | #2 Goal | Data distante deixa os tetos de 300 e 3600 | blocking | [x] |
| K6 | Loop-readiness | #1 | Lista de membros do enum aberta | blocking | [x] |
| K7 | Consistency | ADR-0001 | O contexto entregava `priceVariations` à fase 3 | blocking | [x] |
| K8 | Loop-readiness | #3 | Campo do orderForm sem nome. O loop não cria `customData` | blocking | [x] |

**Simplifications:** A frase de login, a frase genérica e o preço de lista vazio ficam. A cadeia é mostrar que o preço não está disponível, e `formatCartLinePrice` já faz as três. As frases da Kitco e de `priceVariations` ficam no In da fase 3. Elas impedem argumento nativo e impedem o BFF de ler chaves. O gate de #1 Merged fica. Streams diferentes esperam merge, e o nome do sinal nasce no contrato da fase 1. #3 passou a depender de #2. As duas editam `query.ts`. O caminho crítico ficou 3 e o paralelismo ficou 1. A conta inativa continua no preço, no brinde e no TTL. `getBaseId` e o scope `private` ficam de fora do In: as fases não mudam a identidade da linha nem o scope. Nulo no GraphQL é a forma de "o campo não vem".

**Pre-decisions for the loop:** A lista de membros de `reasonKey` não se inventa. O campo publicado segue `String`. Resposta de 2026-11-26 no `/ar-doc`. `validateCart` devolve a string recebida e não grava no orderForm. O nome do campo continua em aberto. O loop não cria `customData`. Resposta de 2026-11-26 nesta checagem. A fase seguinte empilha com `gh stack` na branch da fase anterior e não espera merge. Resposta de 2026-11-26 no loop.

## Carry-over Log

| Type | From | Affects | Note | Link |
|---|---|---|---|---|
| Fact | #1 | #2 | `priceState` já existe. Sem origem, `available` fica verdadeiro até a busca mandar o campo | `feat/cart-price-state` |
| Fact | #1 | #2 | `StoreAggregateOffer` não tem `priceState`. O OrderForm deste repositório também não | `feat/cart-price-state` |
| Doc correction | #1 | roadmap | O fragmento dizia que `priceReasonLabel` saía da API. O código da PR 3592 tirou esse rótulo. A frase ficou na vitrine | https://github.com/vtex/faststore/pull/3592 |
| New scope | #2 | #2, #3 | A fase 2 antiga, quantidade e pagamento na URL, saiu. O TTL usa o `priceState` cru da Intelligent Search, sem `discovery.config`. A query generalista e o `validateCart` são a fase 3 | sessão 2026-11-26 |
| Doc correction | #1 | #1 | Checkout segue no PR 1728 e saiu do caminho crítico | sessão 2026-11-26 |
| Doc correction | Sync | #2, #3 | A nota New scope chamava a query de fase 2. Corrigida nesta Sync: #2 é o TTL, #3 é a query e o `validateCart` | sessão 2026-11-26 |
| Fact | #1 | #2, #3 | PR 3592 segue OPEN, sem merge. #2 e #3 continuam gated on #1 Merged. O PR 1728 também segue OPEN e fora do caminho crítico | https://github.com/vtex/faststore/pull/3592 |

## Carry-over Paths (reserved)

| Phase | Path |
|---|---|
| #1 | `carryover-phase-1.md` |
| #2 | `carryover-phase-2.md` |
| #3 | `carryover-phase-3.md` |

## References

| Doc | Type | Why it matters here |
|---|---|---|
| [preco-externo-storefront](../../brainstorms/preco-externo-storefront/session.md) | Reference | Fases, rollout e o que a conta inativa não pode pagar |
| [adr-0007](../../../local-docs/docs/adrs/adr-0007-vitrine-sem-campo-custom-mantem-o-cache.md) | Reference | Contrato antigo de quantidade e pagamento. Não vincula esta versão |
| [plan-vitrine-quantidade-pagamento](../../../local-docs/docs/plans/plan-vitrine-quantidade-pagamento.md) | Reference | Plano Draft que não deve ser implementado |

## Open Questions

Quem configura os 10 minutos do Janus, e se esse TTL pode cair junto com `priceValidUntil`. Esta entrega não espera essa resposta.

Wholesale e store, no RFC, ainda não têm dono. Não entram em fase até o cliente dizer que mudam o preço.

A lista de membros de `reasonKey` não está fechada. O campo publicado segue `String`.

O campo do orderForm que carrega `priceAffectingParams` não está nomeado. O loop não cria `customData`.
