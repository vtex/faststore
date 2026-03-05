# fc-cart SDK — Code Review

## 🔴 Issues Críticas

- **Reinvenção do data-fetching** — `useCartQuery` reimplementa loading/error/refetch manualmente; projeto já usa SWR v2.2.5 que entrega cache, retry, dedup, revalidação em foco e background refetch grátis
- **`mountedRef` anti-pattern** — Desencorajado pelo React 18; quebra em StrictMode e Suspense; desnecessário com SWR
- **GraphQL como template literals sem codegen** — Zero type-safety, sem persisted queries; projeto já tem codegen configurado com `replaceDocumentWithHash` e operation hashing — fc-cart ignora tudo e envia query text completa em cada request
- **Client GraphQL primitivo** — fetch wrapper de ~58 linhas sem batching, cache, retry ou persisted queries — regressão vs `sdk/graphql/request.ts` que já existe
- **Stale closure no guard `isMutating`** — Valor capturado pelo `useCallback` pode estar desatualizado entre `setState` e re-render; double-click rápido pode passar pelo guard
- **Objeto `callbacks` recriado a cada render** — `{ setCart, setSummary, currentCart: cart }` é literal novo a cada render, invalidando todos os `useCallback`s internos de `useCartMutations` e destruindo memoização cascading
- **Dois sistemas de cart sem boundary** — `cart.tsx` hardcoda `<FCCartPage>` sem feature flag, env var, ou A/B test; sem rollback controlado para o legado se o BFF falhar em produção

## 🟡 Issues Médios

- **Sem persistência de estado** — Usa apenas `useState`; F5 perde o cart e mostra "Loading..." até o BFF responder (legado usa IndexedDB)
- **`getListPrice` retorna mesmo valor nos dois branches** — `FCCartItem.tsx:28-34` nunca diferencia list price de selling price; crossout de preço nunca aparece
- **Optimistic update de `removeItem` decrementa `totalItems` por 1** — Não considera `quantity` do item; header "My Cart (N items)" fica errado até response do servidor
- **`changeQuantity` optimistic não atualiza `totalItems` nem `total`** — Contagem no header fica stale durante a mutation
- **`isMutating` global bloqueia todas as ações** — Flag compartilhado entre 3 mutations; user não pode remover item B enquanto quantity de item A está em flight
- **`currency` importado e não usado** — `FCCartPage.tsx:24` faz destructuring de `currency` do `useSession()` sem utilizá-lo
- **Sem analytics/tracking** — Legado dispara `sendAnalyticsEvent` em add/remove/quantity; fc-cart é silencioso em todas as operações
- **Estilos centralizados em um único SCSS module** — `FCCartList` e `FCEmptyCart` importam styles de `FCCartPage.module.scss`; acoplamento entre componentes
- **`<img>` nativa para unavailable items** — `FCCartList.tsx:65` usa `<img>` enquanto `FCCartItem` usa `<Image>` otimizado; inconsistência sem lazy loading/srcset
- **Sem error recovery** — Tela de erro não oferece botão de retry; user precisa recarregar a página manualmente
- **Sem AbortController** — Client não aceita `AbortSignal`; race conditions possíveis em quantity changes rápidos

## 🟢 Pontos Positivos

- **Tipagem discriminada com union types** — `FCCartUnion` com `__typename` e type guards (`isNonEmptyCart`, `hasPriceDiscount`) é idiomático para GraphQL unions
- **Separação available/unavailable** — Listas e tipos distintos (`FCCartProduct` vs `FCCartUnavailableProduct`) com UI dedicada
- **Rollback nas mutations** — `rollbackRef` salva estado antes do optimistic update e restaura em caso de erro
- **Reutilização de componentes FastStore UI** — `CartItem`, `OrderSummary`, `Button`, `Icon` do `@faststore/ui` mantêm consistência com design system
- **Fragments organizados** — `PRICE_FRAGMENT` → `CART_PRODUCT_FIELDS` → `CART_UNION_FIELDS` compõem de forma legível sem duplicação
- **Cookie parsing seguro** — Extração de `orderFormId` defensiva com null checks e guard para SSR
