# FastCheckout → FastStore: Portabilidade Completa

## Visão Geral

Mapeamento de **100% das features** do FastCheckout client UI (`packages/apps/client/`) para portabilidade ao FastStore, com **reuso total do BFF** (GraphQL em `/api/checkout-bff/graphql`).

### O Que Já Foi Feito (experimental)

Branch `feat/cart-checkout-page` (1 commit: `37e2a4e87`):
- `/cart` page básica (itens, quantidade, remover, cupom, shipping preview, summary, empty state)
- SWR-based query/mutation hooks (substituindo Relay)
- Address autocomplete com Google Places
- **18 arquivos novos, ~2.533 linhas**

### Stack: FastCheckout → FastStore

| Aspecto | FastCheckout | FastStore |
|---|---|---|
| GraphQL Client | Relay (normalized cache, fragments) | SWR + raw fetch ✅ |
| CSS | `vanilla-extract` | SCSS modules + CSS vars |
| Animações | `framer-motion` | CSS transitions |
| i18n | `react-intl` — 3 locales (en/es/pt) | A definir |
| Components | Custom `packages/libs/ui` | `@faststore/ui` |
| State | Relay Store + Context | SWR cache + Context |
| Router | Next.js Pages Router | Next.js Pages Router |

---

## 1. Telas / Páginas

### 1.1 Cart (`/cart`) — PARCIALMENTE FEITO

**~123 componentes** | Complexidade: ALTA

| Feature | Status |
|---|---|
| Lista de itens (disponíveis + indisponíveis) | ✅ |
| Alterar quantidade / remover item | ✅ |
| Cupom (add/remove) | ✅ |
| Shipping preview (Empty/NoSlas/Preview/Delivery) | ✅ |
| Address autocomplete (Google Places) | ✅ |
| Order summary | ✅ |
| Empty cart state | ✅ |
| Cart action button (→ checkout) | ✅ |
| Evento `view_cart` | ✅ |
| Seleção de opção de entrega (`selectDeliveryOption`) | ❌ |
| Evento `begin_checkout` | ❌ |
| Eventos `remove_from_cart` / `add_to_cart` | ❌ |
| Shipping channel selector (Delivery/Pickup tabs) | ❌ |
| Modo Pickup completo (pontos, busca, horários) | ❌ |
| Agrupamento por tipo de entrega (`CartListGroupedByDeliveryType`) | ❌ |
| Especificações do produto (`ProductItemSpecifications`) | ❌ |
| Composições/Assembly (`ProductItemCompositions`) | ❌ |
| Seller info ("Sold by {name}") | ❌ |
| One-Click: Apple Pay (`ApplePayPlaceOrderButton`, flag `ONE_CLICK_APPLE_PAY`) | ❌ |
| One-Click: Google Pay (`GooglePayOneClickCheckoutButton`, flag `ONE_CLICK_GOOGLE_PAY`) | ❌ |
| Comentários do pedido B2B (`Comment`, flag `IS_B2B`) | ❌ |
| Actions guard (`CartActionsGuardProvider`) | ❌ |
| Error boundary | ❌ |
| Extension Points: `cart.cart-list.before/after`, `cart.order-summary.after`, `cart.order-button.after` | ❌ |
| Hearst Terms & Conditions | ❌ |

### 1.2 Cart Multi-Delivery (`/cart-multi-delivery`) — NÃO INICIADO

**~31 componentes** | Flag: `MULTIDELIVERY` | Complexidade: MÉDIA

Itens agrupados por opção de entrega (`CartListByShippingOption`), grupos com SLA/estimativa/preço (`CartListDeliveryOptionGroup`), "Edit delivery" por grupo (drawer), itens sem endereço (flat list), mini cart multi-delivery, `CartItemMultidelivery`.

### 1.3 Cart Punchout (`/punchout`) — NÃO INICIADO

**~36 componentes** | Flags: `IS_B2B` + `sessionType === 'punchout'` | Complexidade: MÉDIA

Cart view dedicado sem fluxo de delivery/payment. CTA via Extension Point (`punchout.order-summary.cta`). Shipping address read-only (ou editável com flag `PUNCHOUT_ADDRESS_EDITION`). Sem cupom. Extension API: `useCartPunchout` — `addItem()`, `removeItem()`, `items`, `sync()`. Itens expõem attachments/compositions/offerings. Extension Points: `cart.cart-list.before`, `layout.footer`.

### 1.4 Empty Cart — PARCIALMENTE FEITO

Mensagem + link "Continuar comprando" ✅. Falta renderizar dentro de Punchout/MultiDelivery.

### 1.5 Delivery (`/delivery`) — NÃO INICIADO

**~96 componentes** | Complexidade: ALTA (tela mais complexa)
**Query**: `DeliveryQuery` → `auth`, `customerInformationForm`, `summary`, `cart`, `coupon`, `shipping_v2`, `storePreferences`, `deliveryAddressForm`, `customFields`, `customer_v2`

**Autenticação (inline)**: Login email+senha (`LoginDrawer`), login com token/magic link (`LoginWithTokenDrawer`), logout, estado logado/deslogado (`auth { isLoggedIn }`), validação de sessão, tratamento de bloqueio/credenciais incorretas/expiração.

**Dados do Cliente**: Formulário dinâmico (email, nome, telefone, documento) via `customerInformationForm`, formulários país-específicos (BRA/USA), tipos Consumer (B2C) / Organization (B2B), newsletter opt-in, "salvar dados" (`updateClientPreferencesData`).

**Endereço de Entrega**: Autocomplete Google Maps + Smarty Street (USA), geolocalização browser (`useGeolocation`), entry manual via `deliveryAddressForm`, endereços salvos com paginação (`SavedAddressesDrawer`), verificação de disponibilidade, tipos de endereço (residencial/comercial/fatura/pickup).

**Opções de Entrega**: Múltiplas opções de SLA (`ShippingOptionsList`), Single SLA / Multi SLA, Scheduled Delivery (date/time picker), estimativa prazo+custo, `ShipToCard`, `DeliveryTo`, `EmptyShipping`.

**Pickup**: Toggle Delivery/Pickup + `updateDeliveryChannel`, lista de pontos (busca por distância), horários, `PickupAddressDrawer`, aviso itens indisponíveis.

**Recipient/Contatos** (flag `RECIPIENT_INFO_FORM`): Formulário destinatário (nome, email, telefone, ramal), busca contatos salvos (debounce 300ms), `saveContact`/`updateContact` mutations.

**Multi-Delivery B2B** (flag `MULTIDELIVERY`): `MultiDeliveryContent`, atribuição per-item, grupos de shipping/pickup multi-delivery, endereço de pickup, action buttons.

**Custom Fields B2B**: Cost Centers, PO Numbers, Locations, Releases, Dynamic Fields, busca paginada, campos obrigatórios/opcionais, atribuição em massa, níveis (item/pedido/campo).

**Outros**: Breadcrumb (Cart→Delivery→Payment→Review), mini cart sidebar/drawer, summary sidebar, action button→Payment, actions guard, remover itens indisponíveis, org info B2B, Extension Point: `delivery.order-button.after`.

### 1.6 Payment (`/payment`) — NÃO INICIADO

**~84 componentes** | Complexidade: ALTA
**Query**: `PaymentQuery` → `cart`, `summary`, `customFields`, `budgetAttachment`, `shipping_v2`, `payment`, `customerDataForm`, `coupon`, `storePreferences`, `customer_v2`

**Métodos de Pagamento**:

| Método | IDs | Complexidade |
|---|---|---|
| Cartão crédito (novo) | 1,2,4,8,9,10,35,39,755,789 | ALTA — CardForm, BIN detection, installments, tokenization |
| Cartão crédito (salvo) | (mesmos) | MÉDIA — `SavedCardList`, CVV optional |
| Cartão expirado | (mesmos) | BAIXA — display-only |
| Gift Card | 16 | MÉDIA — add/remove/balance, múltiplos providers |
| Gift Card loyalty | (special) | MÉDIA — `SpecialGiftCardOption` |
| Boleto | 6 | BAIXA |
| PIX | 125 | ALTA (QR/countdown no OrderPlaced) |
| Cash | 47 | BAIXA |
| PayPal | 152 | MÉDIA — redirect flow |
| Google Pay | 900 | ALTA — SDK/Wallet Hub |
| Apple Pay | 901 | ALTA — `ApplePaySession` native |
| Notes Payable (B2B) | 201-210 | BAIXA |

**Sub-features**: Parcelamento (`installmentOptions` + `selectCreditCardInstallment`), auto-detect bandeira (BIN + `cardNetworksInfo` regex), tipos cartão (crédito/débito/multi), CVV obrigatório vs sem (`useCvvForAuthorization`), tokenização segura (`createTransaction` → `sendPaymentsCallback` → `gatewayCallback_v2`), Card UI visual (`fast-checkout/card-ui`), salvar dados pagamento, cartões org vs pessoal (`cardOrigin`), reCAPTCHA v3, gateway callback v2 (Union: payload ou redirect para 3DS), fluxo redirect (`RedirectPlaceOrderPayload`), messages por método (Pix/Google Pay), erros de pagamento (`PlaceOrderErrorDrawer`).

**B2B**: Custom order fields, Budget card (tabela Available/To Be Spent/Remaining, allocations), place order permission (`PlaceOrdersPermissionDrawer`).

**Outros**: Delivery/pickup summary read-only, mini cart, summary, org info, actions guard, place order (desktop/mobile), Extension Point: `payment.order-button.after`, remover itens indisponíveis.

### 1.7 Review (`/review`) — NÃO INICIADO

**~50 componentes** | Complexidade: MÉDIA
**Query**: `ReviewQuery` → `cart`, `summary`, `customer`, `customer_v2`, `auth`, `shipping_v2`, `payment`, `coupon`, `storePreferences`, `customFields`

Review de: cliente (nome, email, telefone), entrega (endereço + shipping), pickup (ponto retirada), pagamento (método + parcelas). Links de edição → `/delivery` ou `/payment`. Place Order button (reutiliza Payment). Mini cart sidebar/drawer. Guard redirects: `/cart` (vazio), `/delivery` (sem customer), `/payment` (sem payment). Custom fields review (B2B).

### 1.8 Payment Loading (`/payment-loading`) — NÃO INICIADO

Complexidade: BAIXA — Spinner + mensagem 5s → redirect → `/payment`. Usado após redirects de pagamento externo.

### 1.9 Order Placed (`/order-placed/[orderId]`) — NÃO INICIADO

**~49 componentes** | Complexidade: ALTA
**Query**: `OrderPlacedQuery(orderId)` → `order` (total, shipping, paymentList, cart, delivery_v2), `customer_v2`, `budgetAttachment`

**Status**: `approved` (confirmado), `pending` (pendente), `cancelled` (Pix cancelado), `waiting-for-authorization` (B2B — policies), `waiting-for-buying-policy-status` (B2B — polling 1s/10s), `not-confirmed` (B2B — timeout), `denied` (B2B — link voltar).

**PIX**: QR code, copia-e-cola, countdown timer, polling status, erro, "escolher outro método", instruções.

**Outros métodos**: Cartão (bandeira + últimos 4), gift card (últimos dígitos), notes payable (B2B), boleto.

**Gateway Callback**: v1 (`gatewayCallback` — redirect return), v2 (`gatewayCallback_v2` — Union com redirect/3DS).

**B2B**: Authorization Policy (polling status), custom fields display, budget attachment.

**Outros**: Info cliente/entrega/pickup, order summary, save information prompt.

### 1.10 Sign In To Access (`/sign-in`) — NÃO INICIADO

Complexidade: BAIXA | Flag: `SIGN_IN_TO_ACCESS`
Mensagem "Sign in to access" + redirect → `{discoveryUrl}/login`. Guard global B2B (`OrganizationAuthGuard` — `auth { isLoggedIn }`).

### 1.11 Error (`/error`) — NÃO INICIADO

Complexidade: BAIXA — `ErrorLayout` + botão "Go back".

---

## 2. Resumo do Pedido / Order Summary

| Feature | Status |
|---|---|
| Subtotal, frete (ou grátis), descontos, total | ✅ |
| Deduções de gift cards (totalizer separado) | ❌ |
| Impostos customizados (`customTax`) | ❌ |
| Tooltip de impostos (account setting `orderReview.taxTooltip`) | ❌ |

---

## 3. Layout, Navegação & Drawers

### Layout

Header (logo + "voltar"), breadcrumbs (Cart→Delivery→Payment→Review), sidebar colapsável, grid responsivo (mobile/tablet/desktop), sticky action bar mobile, toast notifications (`LayoutToaster`/`ToastBar`), centered block layout, Order Summary Mobile (expandable drawer). Status: ❌ Parcial (Cart tem layout básico).

### Drawers (23 total)

| Drawer | Tela |
|---|---|
| `LoginDrawer`, `LoginWithTokenDrawer` | Delivery |
| `SavedAddressesDrawer`, `PickupAddressDrawer`, `ChangeDeliveryDrawer` | Delivery |
| `DeliveryOptionItemsDrawer`, `PickupOptionItemsDrawer` | Delivery |
| `ProductsAvailabilityDrawer`, `PackagesDrawer`, `ShippingPackageDrawer`, `ShippingSinglePackageDrawer`, `ProductShippingOptionsDrawer` | Delivery |
| `CartItemsDrawer` | Delivery, Payment |
| `CartOptionsDrawer`, `CartMultiDeliveryDrawer` | Cart |
| `AddPromoCodeDrawer`, `AddCommentDrawer` | Cart |
| `PlaceOrderErrorDrawer` | Payment |
| `GiftCardDrawer` | Payment |
| `ReviewItemsDrawerForMobile` | Review |
| `CustomFieldsDrawer` | Delivery, Payment |
| `OneClickMessageDrawer` | Cart |
| `DrawerErrorBoundary` | All |

FastStore equivalent: `SlideOver` do `@faststore/ui`.

### Responsividade

Breakpoints: Mobile <768, Tablet 768-1024, Desktop >1024. Hooks: `useBreakpoint`, `useResponsiveValue`, `useElementWidth`. Mobile: full-width + bottom sticky CTA + expandable summary. Desktop: two-column + sticky sidebar. `IphoneHead` viewport fix.

---

## 4. Extension Points

| Extension Point | Tela |
|---|---|
| `cart.cart-list.before` | Cart, Punchout |
| `cart.cart-list.after`, `cart.order-summary.after`, `cart.order-button.after`, `cart.assembly-options.button.after` | Cart |
| `punchout.order-summary.cta` | Punchout |
| `delivery.order-button.after` | Delivery |
| `payment.order-button.after` | Payment |
| `layout.footer` | All |

**Implementação**: JS modules remotos de `{accountName}.vtexassets.com/faststore-extensions/checkout/checkout-extensions.js`. Dev mode: local WebSocket live reload. Timeout adaptativo (800ms-4000ms). `ExtensionPointErrorBoundary` para isolamento.

---

## 5. One-Click Checkout

**Google Pay**: `@vtex/googlepay-oneclick-checkout`, `ButtonGoogle`, config com `accountName`/`orderFormId`, callback `transactionId`+`orderId`. Flag `ONE_CLICK_GOOGLE_PAY`.

**Apple Pay**: Native `ApplePaySession`. Eventos: ValidateMerchant, ShippingContactSelected (simulation), ShippingMethodSelected (simulation), PaymentAuthorized (place order), PaymentMethodSelected, Cancel. `sessionDataRef` para estado transiente. Flag `ONE_CLICK_APPLE_PAY`.

Desktop: 2 wallets side-by-side. Mobile: full-width. Drawer de erro: `OneClickMessageDrawer`.

---

## 6. Integrações de Terceiros

| Integração | Uso |
|---|---|
| Google Maps | Autocomplete, geolocalização, detalhes de local. Provider configurável |
| Smarty Street | Validação endereço USA (provider alternativo) |
| Google Pay | `@vtex/googlepay-oneclick-checkout` — Wallet Hub |
| Apple Pay | Native `ApplePaySession` — Wallet Hub |
| VTEX Payment Gateway | `createTransaction` → `sendPaymentsCallback` → `gatewayCallback` |
| reCAPTCHA v3 | `InitRecaptchaV3` + `generateRecaptchaToken()` |
| GTM | `InitGoogleTagManager` — ID do account settings |
| Sentry | `IdentifySentryUser` |
| SmartLook | `InitSmartLook` — accounts Hearst |
| ActivityFlow | `InitActivityFlow` — session tracking |

---

## 7. i18n

`react-intl` (FormatJS) | Locales: `en-us`, `es-mx`, `pt-br` | Provider: `IntlProvider` (default `"en-US"`) | Files: `packages/libs/i18n/src/locales/{locale}.json` | Keys: `checkout/{screen}.{key}` | ~200+ message IDs | Formatação locale-specific (moeda, datas, números) | Formulários país-specific (BRA: CPF/CEP, USA: ZIP/SSN).

---

## 8. Feature Flags

| Flag | Escopo | Efeito |
|---|---|---|
| `IS_B2B` | All | Comments, cost centers, org info, budget, auth policy, punchout |
| `MULTIDELIVERY` | Cart, Delivery | Multi-delivery mode |
| `ONE_CLICK_APPLE_PAY` | Cart | Apple Pay one-click |
| `ONE_CLICK_GOOGLE_PAY` | Cart | Google Pay one-click |
| `PUNCHOUT_ADDRESS_EDITION` | Punchout | Edição de endereço |
| `SIGN_IN_TO_ACCESS` | Global | Login B2B obrigatório |
| `RECIPIENT_INFO_FORM` | Delivery | Form de destinatário (sempre `true`) |
| `CUSTOM_FIELDS_V2` | Delivery, Payment | V2 de custom fields |
| `SETTINGS_API` | Global | Integração Settings API |

---

## 9. Account Settings

`branding.color` (oklch → CSS vars), `branding.logo` (URL), `advanced.gtmId`, `cart.maximumQuantitySelector`, address provider (type, API key, max results), `orderReview.taxTooltip`. Window global: `window.__FASTCHECKOUT__` = `{ orderFormId, accountName, sessionType, version }`.

---

## 10. Analytics

| Evento | Tela | Trigger |
|---|---|---|
| `view_cart` ✅ | Cart | Mount |
| `begin_checkout` ❌ | Cart→Delivery | Click "Continue to Checkout" |
| `add_shipping_info` ❌ | Delivery | Shipping submitted |
| `add_payment_info` ❌ | Payment | Payment submitted |
| `purchase` ❌ | OrderPlaced / Cart (one-click) | Order placed |
| `add_to_cart` ❌ | Cart | Qty aumentada |
| `remove_from_cart` ❌ | Cart | Item removido / qty diminuída |

Via `sendGTMEvent` de `@next/third-parties/google`. GA4 ecommerce spec. Só produção.

---

## 11. BFF: Queries & Mutations

### Queries (20+)

| Query | Telas |
|---|---|
| `cart` (CartUnion) | Cart, Delivery, Payment, Review |
| `summary` | Cart, Delivery, Payment, Review |
| `shipping` / `shipping_v2` | Cart, Delivery, Payment, Review |
| `coupon` | Cart, Delivery, Payment, Review |
| `payment` (options, saved cards, gift cards, installments) | Payment, Review |
| `auth` (isLoggedIn) | Cart, Delivery, Review |
| `customer` / `customer_v2` (Consumer \| Organization) | Delivery, Payment, Review, OrderPlaced |
| `storePreferences` | All |
| `comment` | Cart (B2B) |
| `customerInformationForm` / `customerDataForm` | Delivery / Payment |
| `deliveryAddressForm` | Delivery |
| `customFields` | Delivery, Payment, OrderPlaced |
| `budgetAttachment` | Payment, OrderPlaced |
| `oneClickCheckoutOptions` | Cart |
| `order(id)` | OrderPlaced |
| `orderAuthorizationPolicyData(orderId)` | OrderPlaced (B2B) |
| `addressSuggestion` | Cart, Delivery |
| `searchSavedContacts` | Delivery |
| `specifications(input)` | Cart |

### Mutations (35+)

**Cart**: `changeProductQuantity`, `removeProduct`, `removeProducts`, `addPromoCode`, `removePromoCode`, `updateComment` (B2B).

**Address/Shipping**: `updateAddress`, `findAddressDetailsAndUpdateAddress`, `updateDeliveryChannel`, `selectDeliveryOption`.

**Customer**: `updateCustomerInfo`, `updateClientPreferencesData`, `saveContact`, `updateContact`.

**Payment**: `selectPaymentOption`, `selectCreditCardPaymentOption`, `selectCreditCardInstallment`, `selectSavedCard`, `addGiftCard`, `removeGiftCard`.

**Place Order**: `placeOrder`, `placeOrderWithPaymentOption`, `createTransaction`, `sendPaymentsCallback`, `gatewayCallback`, `gatewayCallback_v2`.

**Auth**: `login`, `sendAccessKey`, `validateAccessKey`, `logout`.

**Apple/Google Pay**: `validateMerchant`, `shippingSimulation`, `placeOrderApplePay`, `placeOrderGooglePay`.

**B2B**: `updateCustomFields`, `uploadBudgetAttachment`.

---

## 12. Infraestrutura a Construir

### Data Layer (Relay → SWR)

| Feature | Status |
|---|---|
| `useBffQuery` (SWR) / `useBffMutation` | ✅ |
| Fragments → inline data selection | ✅ |
| `orderFormId` header (cookie-based proxy) | ✅ |
| Normalized cache → SWR full revalidation | ⚠️ Funcional, menos granular |
| Optimistic updates | ❌ Necessário |

### Patterns a Portar

- **Actions Guard**: Factory `create-actions-guard` → contexts per-screen (Cart, Punchout, Shipping, Payment)
- **Validation Queue**: `ValidationQueueContext` — enfileira validações para place order (Delivery, Payment)
- **Error Handling**: `ErrorBoundary`/`ErrorLayout` (page-level), `DrawerErrorBoundary`, `ExtensionPointErrorBoundary`, `PlaceOrderErrorDrawer`, toast notifications

---

## 13. Dependências Externas & Shared Libraries

### Dependências

| Dep | Status/Ação |
|---|---|
| `relay-runtime` / `react-relay` | ✅ Substituído por SWR |
| `vanilla-extract` | ✅ Substituído por SCSS |
| `react-intl` | Decisão necessária |
| `framer-motion` | CSS transitions |
| `@next/third-parties/google` | FastStore GTM setup |
| `@sentry/nextjs` | Verificar FastStore |
| `@vtex/googlepay-oneclick-checkout` | Portar como dep |
| Google Places API | ✅ Integrado |
| Smarty Street, reCAPTCHA v3 | Portar |

### Shared Libraries (`packages/libs/`)

| Lib | Ação |
|---|---|
| `ui` | Mapear → `@faststore/ui` |
| `i18n` | Portar translations (3 locales) |
| `types`, `constants` | Portar relevantes |
| `validators`, `address-form`, `input-mask` | Portar |
| `card-ui` | Portar ou adaptar |
| `logger` | Adaptar (Sentry) |
| `extensions` | Portar se extensions incluídas |
| `checkout-ui-core` | Avaliar reuso |

---

## 14. Decisões Arquiteturais Pendentes

| Decisão | Opções |
|---|---|
| SSR vs CSR | Todo CSR (atual) vs SSR para load inicial |
| i18n | `react-intl` vs FastStore i18n vs hardcoded |
| Checkout header | Reuse FastStore vs simplificado |
| `orderFormId` | URL param vs cookie-only |
| Operations files | Single file vs per-screen |
| Multi-step state | SWR only vs local state para forms |
| Place order flow | Direct mutation vs redirect-based |
| BFF URL config | Hardcoded vs env var vs store config |
| Form handling | Raw state vs react-hook-form vs formik |
| Error strategy | Per-component vs page-level vs ambos |
| Card UI | Portar `card-ui` vs build new vs third-party |
| Drawers | `SlideOver` (FastStore) vs custom |
| Extensions | Portar as-is vs FastStore sections vs skip |
| Branding/theming | CSS vars FastStore vs portar vanilla-extract theme |

---

## 15. Números Gerais

| Métrica | Valor |
|---|---|
| Páginas/Rotas | 13 |
| Telas (screens) | 12 |
| Componentes únicos (screen + core) | **~300+** |
| Métodos de pagamento | 12+ |
| Queries / Mutations | 20+ / 35+ |
| Drawers | 23 |
| Extension points | 9 |
| Feature flags | 9 |
| Locales | 3 |
| Analytics events | 7 (GA4) |
| Third-party integrations | 10 |

### Componentes por Tela

| Tela | Total |
|---|---|
| Cart | ~123 |
| Delivery | ~96 |
| Payment | ~84 |
| Review | ~50 |
| Order Placed | ~49 |
| Punchout | ~36 |
| Multi-Delivery | ~31 |
| Outros (Empty, Loading, SignIn, Error) | ~12 |

### Progresso

**Feito** (18 arquivos, ~2.533 linhas): BFF proxy, SWR hooks, Cart básico, Google Places.

**Falta** (~300+ componentes, ~15-20K+ linhas): Cart features restantes (~100+), Cart Multi-Delivery (~31), Punchout (~36), Delivery (~96), Payment (~84), Review (~50), Order Placed (~49), Payment Loading, Sign In, Error, auth system, layout/drawers (23), forms, i18n (~200+ keys), analytics (6/7 events), actions guard, extensions (9 points), B2B completo, integrações (reCAPTCHA, Smarty, Apple/Google Pay SDK, SmartLook, ActivityFlow), account settings, shared libs.
