---
status: handed-off
related:
  - preco-minicart-e-vitrine: roadmap de 2026-11-16 cuja fase 2 coloca quantidade e pagamento na query. Esse contrato foi substituído aqui.
  - preco-fase-3: sessão local de 2026-11-25. A ida do `priceAffectingParams` permanece. A volta junto de `priceState` substitui o trecho "sem affectingParams na resposta".
last-updated: 2026-11-26
---

# Preço externo na vitrine — Brainstorm

## Need

A vitrine precisa mostrar um preço que a integração externa pode não ter ainda, sem mudar o preço de quem não usa a feature, e sem a plataforma inventar os parâmetros de cada cliente.

## Ground

| Source | Where read | What it settled |
|---|---|---|
| RFC 0.6 colado em 2026-11-26 | chat | Fases 2 e 3 do corpo batem com o plano. O tipo da fase 1, o bloco `priceVariations`, o cenário Kitco e as perguntas abertas não batem. |
| [bff-devolve-price-state-disponivel](knowledge/bff-devolve-price-state-disponivel.md) | `priceState.ts`, `offer.graphql` | Sem origem, `available` fica verdadeiro. |
| [cache-graphql-e-estatico](knowledge/cache-graphql-e-estatico.md) | `query.graphql`, `graphql.ts` | TTL de 5 min e SWR de 1 h são fixos. O Janus não é ajustado neste repositório. |
| [queries-nativas-sem-quantity-payment](knowledge/queries-nativas-sem-quantity-payment.md) | `query.graphql`, plano local, `gh pr list` | Quantidade e pagamento não estão nas queries. O plano que os adiciona está em Draft e sem PR. |
| PR 3592 | `feat/cart-price-state` | Fase 1 do FastStore aberta. Contrato `{ available, reasonKey }`. |
| PR 1728 | `vcs.checkout-ui` `feat/cart-line-price-state` | Checkout lê o estado quando o item traz. |
| adr-0007 | `local-docs/docs/adrs/adr-0007-vitrine-sem-campo-custom-mantem-o-cache.md` | Decisão antiga: quantidade e pagamento entram na URL. Substituída. |
| roadmap | `docs/roadmaps/preco-minicart-e-vitrine/roadmap.md` | Fase 2 ainda descreve essa URL. Vai ser reescrita no faseamento. |

## Queue

## Threads

### RFC 0.6 contra o plano — **closed**

O recorte em três fases está certo. A fase 2 do RFC, como colada, expira o cache pelo `priceValidUntil`. A fase 3 manda `priceAffectingParams: String`, parte a CDN e o Janus com esse texto, e devolve o mesmo texto em `priceState`.

`priceValidUntil` é `String`, uma data. `reasonKey` no plano é enum. `priceVariations` entra no `priceState` como objeto livre.

### Contrato do priceState — **closed**

`reasonKey` é enum. `priceVariations` é um objeto livre que a integração externa devolve para a tela. O BFF repassa e não lê as chaves. Sem o objeto, o campo não vem. No GraphQL esse campo é nulo. A tela, nesta leva, usa só a frase. O uso de `priceVariations` na tela fica para um plano seguinte.

Brinde é preço 0 com `available` verdadeiro. `available` falso não é brinde e entra com zero no total da linha. Texto que diga o contrário está errado.

### Plano generalista — **closed**

O plano habilita o cenário do cliente em vez de implementar o cenário. `product` e `search` aceitam `priceAffectingParams: String`. O cliente monta o JSON (quantidade, pagamento, peso, o que for) e declara a variável na query dele. A query nativa não ganha campo por cenário e não envia a string. Isso já basta para o cliente consultar.

Pedir `priceState` numa query da plataforma é outra decisão: a tela nossa passa a ler `available` e `reasonKey`. Não é o que habilita a query do cliente. A query do cliente pede os campos que ela quiser. Sem a string, a chave de cache continua a de hoje. Com a string, a CDN e a URL do Janus partem, e a mesma string volta em `priceState`.

### Quem manda o parâmetro custom — **closed**

Quantidade e meio de pagamento não viram campo nativo. A Kitco coloca os dois no JSON de `priceAffectingParams`. O que ela devolve em `priceVariations` é critério dela. O BFF não lê esse objeto.

We Buy / We Sell continua facet de departamento (`category-1`), fora do JSON. Moeda continua no sales channel que a URL já carrega.

### Rollout e conta com a feature inativa — **closed**

A flag é por conta e só liga depois do BFF publicar `priceState` e da vitrine saber ler `available: false`. Com a origem sem `priceState`, o BFF devolve `available: true` e `reasonKey` nulo. Número, brinde (`preço === 0` e `available` verdadeiro) e totais ficam como hoje. O cap de TTL só roda quando a Intelligent Search mandou `priceState` naquela resposta. A data sozinha, que já vem hoje, não liga o cap.

Pedir `priceState` nos fragmentos muda o hash da persisted query uma vez. A conta inativa sofre um miss e recebe o mesmo preço, com o objeto default. Isso é o preço nomeado de publicar o campo. Não é mudança de preço.

A fase 3 não tem flag. Argumento ausente, `null` ou `""` não segue. A URL de hoje permanece. `{}` ou outra ordem de chaves cria outra entrada. Quem não manda o argumento não paga essa entrada.

### Cache da fase 2 — **named price**

O teto da CDN neste repositório é `s-maxage=300` e `stale-while-revalidate=3600`, gravados na diretiva de `product` e `search`. Com a flag ligada, `s-maxage` vira `min(300, segundos até a data mais cedo)` e `stale-while-revalidate` vira `min(3600, esse mesmo restante)`. Os dois acabam na data, sem a hora de SWR servir o preço velho. Data distante deixa os tetos. Data ilegível ou flag desligada não altera o hint. Data no passado, com a flag ligada, zera os dois.

O cap não usa `discovery.config`. O sinal é o `priceState` cru do Intelligent Search, antes de o BFF preencher `available: true`. Se nenhuma oferta da resposta chegou com esse campo, o TTL fica 300 e 3600, mesmo com `priceValidUntil` no payload. Se alguma chegou, `s-maxage = min(300, segundos até a data mais cedo entre essas ofertas)` e `stale-while-revalidate = min(3600, esses segundos)`. Data ilegível não entra na conta. Data no passado zera os dois. O objeto que o BFF devolve sempre não conta como sinal.

O cliente de Intelligent Search daqui não escreve o TTL do Janus. A chave do Janus, na fase 3, é outra coisa: a URL `product-search` que o BFF já monta. O parâmetro entra nessa URL. O teto de 10 minutos do Janus fica de fora desta entrega.

### Volta do parâmetro — **closed**

`priceState` ganha `priceAffectingParams: String` opcional. A resposta repete a string enviada em cada oferta daquela resposta. A tela lê dali. Request sem a string omite o campo. No GraphQL esse campo é nulo. O BFF copia o texto e não lê as chaves.

`useOffer` fica de fora: chama a Intelligent Search direto e não vê o argumento. `validateCart` entra na fase 3: recebe a mesma string, repassa na atualização do orderForm, segue POST e `no-store`, e devolve a string na linha.

## Knowledge

| Note | Kind | Scope | Cited by thread |
|---|---|---|---|
| [Sem origem, o preço fica disponível](knowledge/bff-devolve-price-state-disponivel.md) | project-analysis | local | Rollout e conta com a feature inativa |
| [TTL de product e search é fixo](knowledge/cache-graphql-e-estatico.md) | project-analysis | local | Cache da fase 2 |
| [Queries nativas sem quantity e paymentMethod](knowledge/queries-nativas-sem-quantity-payment.md) | project-analysis | local | Quem manda o parâmetro custom |

## Convergence

**Invariant:** A plataforma entrega o estado do preço e um único argumento opcional. O cliente preenche o argumento quando o preço dele depende de um campo que a query nativa não tem. Conta com a feature desligada continua no preço, no brinde e no TTL de hoje.

| Gap | Criticality | Mitigation | Blocks? |
|---|---|---|---|
| Texto que chame `available: false` de brinde | high | Brinde é preço 0 com `available` verdadeiro. `available` falso não é brinde | engineering |
| adr-0007 e o plano da vitrine colocam quantidade e pagamento na URL | high | Não implementar esse plano. A fase 2 do roadmap novo não tem esses argumentos | engineering |
| TTL do Janus não é escrito neste repositório | high | A fase do TTL entrega só a CDN. O teto de 10 min do Janus fica fora, sem dono neste repo | engineering |
| O BFF sempre devolve `priceState` | high | O cap lê o campo cru da Intelligent Search, antes do default. Sem esse campo na origem, a data não muda o TTL | engineering |
| Pedir `priceState` troca o hash de cada operação alterada | med | O generate já registra a persisted query. Uma conta inativa paga um miss por operação e recebe `available: true` | engineering |
| PDP com `useOffer` e o HTML estático não passam pelo argumento | med | Fora da fase das telas. A frase entra nas queries do BFF. A primeira pintura estática e o `useOffer` ficam no preço default | engineering |
| `{}` ou ordem de chaves parte a CDN | med | O cliente ordena as chaves. Ausente, `null` e `""` não vão. O BFF não reordena | engineering |
| Checkout não recalcula totalizers a partir de `priceState` | low | A linha mostra a frase. O total do pedido continua o do Checkout | engineering |

**Named prices:** A conta inativa paga um miss quando o fragmento passa a pedir `priceState`, e recebe o mesmo número. A conta que manda `priceAffectingParams` ocupa uma entrada de CDN e de Janus por texto. PDP com a string e galeria sem ela mostram mapas diferentes. Logado não compartilha a CDN.

**Residual pass:** Com a flag desligada, nenhum argumento novo sai na URL e o TTL não muda. O único efeito é o campo default na resposta das queries que passam a pedi-lo. Nada disso zera um preço nem transforma um item pago em brinde.

**Slices, in dependency order:**

1. Frase no minicart. `reasonKey` enum. `priceVariations` objeto livre, repassado sem leitura. Checkout segue e não trava.
2. TTL da CDN só quando a Intelligent Search mandou `priceState`. O teto do Janus fica de fora.
3. `priceAffectingParams` em `product`, `search` e `validateCart`.

## Handoff

- Chosen: fasear em três stacks no roadmap `preco-minicart-e-vitrine`
- Artifact: `docs/roadmaps/preco-minicart-e-vitrine/roadmap.md`
