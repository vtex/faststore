---
kind: lesson
source: preco-minicart-e-vitrine #2
read: 2026-11-27
confidence: high
tags: [price, search]
---

# Quantidade e pagamento não viram argumento nativo de busca

**Evidence:** A fase 2 antiga punha quantidade e pagamento na URL. A Sync corrigiu a numeração: a fase 2 só reduz o TTL da CDN quando a Intelligent Search manda o objeto cru `priceState`. A fase 3 aceita uma string opaca, `priceAffectingParams`, em `product`, `search` e `validateCart`. O cliente monta quantidade e pagamento dentro dessa string. Os documentos nativos de produto e busca não declaram a variável.

**Applies when:** o preço de uma consulta depende de contexto que o cliente monta.

**Breaks when:** quantidade ou meio de pagamento virar campo nativo do contrato de busca.
