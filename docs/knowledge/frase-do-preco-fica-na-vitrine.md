---
kind: lesson
source: preco-minicart-e-vitrine #1
read: 2026-11-27
confidence: high
tags: [price, cart]
---

# A frase do preço fica na vitrine, não num rótulo da API

**Evidence:** O carry-over da fase 1 dizia que `priceReasonLabel` saía da API. O código da PR 3592 tirou esse rótulo. A frase ficou em `formatCartLinePrice`, com as chaves de CMS `priceMessages.login` e `priceMessages.generic`. O campo publicado é `priceState.reasonKey: String`.

**Applies when:** uma fase mostra por que o preço não está disponível.

**Breaks when:** a API passar a devolver o texto já traduzido e a vitrine deixar de escolher a frase.
