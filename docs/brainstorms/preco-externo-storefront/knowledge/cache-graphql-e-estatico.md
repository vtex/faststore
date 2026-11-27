---
kind: project-analysis
source: packages/api/src/platforms/vtex/typeDefs/query.graphql
read: 2026-11-26
confidence: high
tags: [cache, price-valid-until]
---

# O TTL de product e search é fixo no schema

**Evidence:** `product` e `search` declaram `@cacheControl(scope: "public", sMaxAge: 300, staleWhileRevalidate: 3600)`. A diretiva grava esse par em `ctx.cacheControl` antes do resolver, usando o menor valor entre os campos. `packages/core/src/pages/api/graphql.ts` prefere esse hint ao default de 5 minutos e 1 hora. Não há leitura de `priceValidUntil` nesse caminho. O cliente de Intelligent Search neste repositório não escreve `Cache-Control` nem `s-maxage` na ida ao Janus.

**Applies when:** a fase 2 for encurtar o TTL pela data da oferta.

**Breaks when:** outro serviço passar a definir o TTL do Janus fora deste repositório e o BFF não tiver como reduzi-lo.
