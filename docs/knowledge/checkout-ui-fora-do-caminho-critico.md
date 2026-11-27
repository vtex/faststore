---
kind: lesson
source: preco-minicart-e-vitrine #1
read: 2026-11-27
confidence: high
tags: [checkout, roadmap]
---

# Checkout que não trava a vitrine fica fora do caminho crítico

**Evidence:** O PR 1728 em `vcs.checkout-ui` lê `priceState` quando o item traz o campo. O total do pedido continua no totalizer. O roadmap tirou esse PR do caminho crítico. As fases 2 e 3 seguiram sem ele.

**Applies when:** a tela de checkout só espelha um campo que a vitrine já mostra, e o total não muda.

**Breaks when:** o checkout passar a ser a única superfície que grava ou decide o preço.
