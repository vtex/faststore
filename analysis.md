# FastCheckout <> FastStore: Análise de Portabilidade

## Conclusão

A portabilidade do FastCheckout para a FastStore é viável, mas representa um esforço significativo. Um experimento com escopo reduzido (tela de Cart simplificada) demonstrou que é possível reutilizar 100% do BFF existente, porém a migração completa envolve **6 frentes de trabalho** — desde infraestrutura de data-layer e state management, passando pela recriação de 300+ componentes, até a integração com CMS e extensibilidade — com estimativa total de **XX dev weeks**.

## Resultado do experimento

O escopo focou em um pedaço pequeno do Cart do FastCheckout, assumindo reuso de 100% do BFF do FastCheckout e considerando apenas as funcionalidades:

- Listagem simples (sem agrupamento) com operações de alteração de quantidade e remoção
- Seleção de endereço de entrega (delivery-only) a partir do postal code (busca com autocomplete)
- Resumo da compra com totalizadores de entrega, subtotal e descontos
- Reatividade simples a alterações de estado (e.g. atualizar o summary após alterar quantidade)

A qualidade do código foi baixa, mas não houve esforço em criar uma estrutura sólida ou de-para de padrões diferentes entre os projetos. O resultado foi uma tela de carrinho funcional no geral, mas que demandaria ajustes de experiência (e.g. feedbacks de erro, estados de loading, empty state, etc).

## Estimativa de alto nível da portabilidade

Para estimar a portabilidade, a migração foi dividida em algumas etapas, já considerando o uso massivo de AI Agents para portar código:

### 1. Core Data-Layer
> Estimativa: XX dev weeks

Adicionar uma infraestrutura que permita se comunicar com o BFF do FastCheckout utilizando a stack do FastStore Discovery.

### 2. Core State Management
> Estimativa: XX dev weeks

Adicionar uma infraestrutura que permita gerenciar estado compartilhado e interdependência entre os componentes.

### 3. Specialized Components
> Estimativa: XX dev weeks

Portar todos os NN componentes do core, que são utilizados entre todas as telas do FastCheckout, e disponibilizá-los como building blocks da SDK do FastStore.

### 4. Construir versão mínima do SDK
> Estimativa: XX dev weeks

Extrair building blocks comuns a todas as telas, que se apoiam no BFF, e disponibilizar como React hooks ou utility functions. A lista não foi gerada, mas exemplos incluem:

- `useShippingAddress`
- `usePickupAddress`
- `useCartItems`
- `useCustomFields`
- `useRecipientInfo`
- etc

### 5. Migração de telas

A partir do que foi desenvolvido nas etapas anteriores:

| Tela | Componentes específicos | Componentes core utilizados | Complexidade |
|------|------------------------:|----------------------------:|:------------|
| Punchout | 8 | 20 | Média |
| Cart | 45 | 21 | Alta |
| Delivery | 50 | 32 | Alta |
| Payments | 33 | 25 | Alta |
| Review | 10 | 18 | Média |
| Order Placed | 25 | 10 | Média |
| Telas de suporte (Sign In, Error, Empty Cart) | 0 | 14 | Baixa |

### 6. Adicionar camada de extensibilidade
> Estimativa: XX dev weeks

Atualmente o FastCheckout é intencionalmente menos customizável que o Discovery (baseado na visão do produto). Para adicionar a camada de extensibilidade no nível de flexibilidade similar ao Discovery, precisaríamos minimamente integrar diversos pontos de extensão em todas as telas.

---

## Contexto

### Estado atual do FastCheckout

Atualmente o FastCheckout possui NN features, suportando tanto use cases de B2C mais simples — como carrinhos com agrupamentos por disponibilidade ou data de entrega, seja pickup ou delivery — até cenários mais complexos como seleção de entrega por item, entrega agendada e pagamentos com one-click via Apple e Google Pay. Além disso, tem features de B2B Offer como Punchout, Roles & Permissions, Credit Card Tokenization, Bundles, Scheduled Delivery, etc.

O FastCheckout tem dois principais componentes na arquitetura:

- **FastCheckout BFF** — back-end for front-end que faz o meio de campo com 10 APIs da VTEX (e.g. Checkout, MasterData, Identity, Intelligent Search, etc).
- **FastCheckout UI** — que atualmente conta com mais de 300 core componentes, distribuídos entre as etapas de Cart, Delivery, Payments e Order Placed.

### O que precisamos migrar

- **Portar Specialized Components:** O FastCheckout utiliza componentes de uma biblioteca diferente da FastStore, portanto seria necessário _recriar_ os "specialized" components (e.g. CartList, ShippingPreview, etc) utilizando o design system da FastStore.

- **Migrar data-layer:** O FastCheckout utiliza Relay, um GraphQL client criado pela Meta. A FastStore utiliza uma solução que é uma camada mais "fina", sem gerenciamento de estado tão pesado. Teríamos que migrar toda a camada de estado para a solução da FastStore, que é envelop + fetch.

- **Migrar arquitetura de extensibilidade:** A extensibilidade do FastCheckout utiliza FastStore Extension Points, que são pontos de inserção de componentes. Dependendo do escopo necessário, seria necessário adicionar suporte a section overrides (já suportado pelo FastStore Discovery) e/ou readequar o section override para essa API (FastStore Extension Points em teoria faz parte do guarda-chuva FastStore, segundo a spec do FastStore Platform).

- **Criação do SDK:** Atualmente o FastCheckout é um produto mais "autocontido", sem a intenção de fornecer um SDK como o FastStore Discovery. Nenhum recurso do BFF — como seleção de endereço, busca de endereço por autocomplete, pagamento com cartão, etc — está disponível como React hook ou componente. Seria necessário migrar os mais de 300 componentes do core e padronizar os recursos em React hooks e funções utilitárias.

- **Integração com o CMS:** Atualmente a montagem das telas do FastCheckout é totalmente estática — o layout é posicionado de forma única para todos os clientes, sem movimentar blocos ou seções de um lado para o outro. Considerando que o CMS é parte crucial da experiência de customização, será necessário se integrar ao CMS para fazer a renderização das telas conforme o CMS especifica.
