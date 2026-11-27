---
kind: project-analysis
source: packages/api/src/platforms/vtex/typeDefs/query.graphql
read: 2026-11-26
confidence: high
tags: [price-affecting-params, phase-2]
---

# As queries nativas não recebem quantity nem paymentMethod

**Evidence:** `Query.product` recebe `locator`. `Query.search` recebe paginação, `sort`, `term`, `selectedFacets` e `sponsoredCount`. Nenhum dos dois tem `quantity` nem `paymentMethod`. O plano `local-docs/docs/plans/plan-vitrine-quantidade-pagamento.md` (Draft, 2026-11-16) manda acrescentar esses dois argumentos e colocá-los na URL. Esse plano não está em código nem em PR aberto. O único PR aberto do autor em `vtex/faststore` é o 3592, `feat/cart-price-state`.

**Applies when:** a fase 2 for desenhada de novo. Quantidade e meio de pagamento ficam com o cliente, no JSON da fase 3.

**Breaks when:** um PR posterior tiver mergeado esses argumentos nas queries nativas.
