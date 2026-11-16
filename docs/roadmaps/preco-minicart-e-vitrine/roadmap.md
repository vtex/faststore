# Preço no minicart e na vitrine — Roadmap

> **Status**: Active
> **Last updated**: 2026-11-16

## Goal

O comprador vê preço, brinde ou motivo na linha do minicart, e a vitrine continua no cache de hoje quando a quantidade ou o método de pagamento mudam a busca.

## Phases

| # | Phase | Depends on | Status |
|---|---|---|---|
| 1 | Preço da linha no minicart | — | Done |
| 2 | Vitrine com quantidade e pagamento | #1 | Spec'd |

### Phase 1 — Preço da linha no minicart

**Goal:** A linha do minicart mostra preço, brinde ou motivo a partir do número e de `available`.

**In:** `priceState` na oferta do carrinho, o desenho da linha e a separação de brinde por número e `available`.
**Out:** o rótulo e a nova busca da vitrine (#2). O mapa `public.priceAffectingParams`, a passada do SWR e o `no-store` ficam fora deste roadmap. A tela do Checkout no repositório `vcs.checkout-ui` fica fora deste roadmap.

**Source:** [adr-0003](../../adrs/adr-0003-estado-do-preco-no-minicart-e-checkout.md) — `Decision`, `Consequences`. [adr-0004](../../adrs/adr-0004-contexto-de-preco-no-checkout.md) — `Decision` (política comercial nesta fase). [tdd-minicart-checkout-preco.md](../../tdds/tdd-minicart-checkout-preco.md) — `Building Blocks`, `Key Flows > Incluir item e confirmar o preço`, `Key Flows > Linha sem preço e brinde`, `Interfaces`.

**Notes for the spec:** O `OrderForm` deste repositório não tem `priceState`. Até esse campo existir, a validação devolve `available: true`. O FastStore não lê `isGift` do OrderForm. O sufixo `Gift` do identificador permanece. O `sc` do GET e do PATCH permanece.

### Phase 2 — Vitrine com quantidade e pagamento

**Goal:** A vitrine mostra o estado ao lado do número e refaz a query de preço quando a quantidade ou o método de pagamento mudam, com o cache de hoje.

**In:** `priceState` nos fragmentos de produto, quantidade e método de pagamento nas variáveis e na URL da busca, rótulo pela mesma tabela da linha.
**Out:** gravação de `public.priceAffectingParams`, lista `affectingParams`, passada do SWR e `private, no-store` (fora deste roadmap). `useOffer` fica fora. O minicart fica em #1.

**Source:** [adr-0007](../../adrs/adr-0007-vitrine-sem-campo-custom-mantem-o-cache.md) — `Decision`, `Consequences`. [adr-0002](../../adrs/adr-0002-union-de-preco-via-intelligent-search.md) — `Decision` (tabela e `priceState` na oferta e no agregado). [tdd-preco-na-vitrine.md](../../tdds/tdd-preco-na-vitrine.md) — `Building Blocks` (queries de preço; o fluxo do mapa não entra nesta fase).

**Notes for the spec:** O campo opcional da Intelligent Search não está tipado neste repositório. Sem ele, `available` fica `true`. Não há seletor de método de pagamento neste repositório. A quantidade da página de produto está em `ProductDetails` e a query está em `pages/[slug]/p.tsx`. Com `useOffer` ligado, a PDP não usa `useProductQuery`.

## Dependency Graph

```mermaid
flowchart LR
    1[Phase 1] --> 2[Phase 2]
```

## Streams

- **Critical path**: 2 phases (#1 → #2)
- **Max parallelism**: 1 (widest wave: #1, depois #2)

| Stream | Phases, in order |
|---|---|
| A | #1, #2 |

## Carry-over Log

Nenhum fragmento absorvido nesta criação.

## Carry-over Paths (reserved)

| Phase | Path |
|---|---|
| #1 | `carryover-phase-1.md` |
| #2 | `carryover-phase-2.md` |

## References

| Doc | Type | Why it matters here |
|---|---|---|
| [tdd-minicart-checkout-preco.md](../../tdds/tdd-minicart-checkout-preco.md) | Reference | Blocos do carrinho e da validação |
| [tdd-preco-na-vitrine.md](../../tdds/tdd-preco-na-vitrine.md) | Reference | Queries de preço da vitrine. O fluxo do mapa fica fora |
| [adr-0002](../../adrs/adr-0002-union-de-preco-via-intelligent-search.md) | Binding | Números obrigatórios e tabela número + `available` |
| [adr-0003](../../adrs/adr-0003-estado-do-preco-no-minicart-e-checkout.md) | Binding | `priceState` na linha e o que ela desenha |
| [adr-0004](../../adrs/adr-0004-contexto-de-preco-no-checkout.md) | Binding | Nesta fase o contexto do carrinho é o `sc` |
| [adr-0007](../../adrs/adr-0007-vitrine-sem-campo-custom-mantem-o-cache.md) | Binding | Cache de hoje, e a query refaz quando quantidade ou pagamento mudam |

## Open Questions

A chave de cache de preço por item do Checkout não está neste repositório. Falta confirmar que ela inclui `sc`.

O nome do campo opcional de estado de preço na Intelligent Search não está neste repositório.

Não há seletor de método de pagamento neste repositório.
