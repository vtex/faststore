# FastCheckout — Inventario Completo de Componentes UI

## Resumo Geral

| Categoria | Quantidade |
|-----------|-----------|
| **Core/Shared Components** | **90** |
| **Componentes locais (todas as telas)** | **~181** |
| **Total de componentes UI** | **~271** |

| Tela | Locais | Core usados | Complexidade |
|------|--------|-------------|-------------|
| Delivery | ~50 | ~32 | Alta |
| Cart | ~45 | ~21 | Alta |
| Payment | ~33 | ~25 | Alta |
| OrderPlaced | ~25 | ~10 | Media |
| Review | ~10 | ~18 | Media |
| CartMultiDelivery | ~10 | ~7 | Media |
| CartPunchout | ~8 | ~20 | Media |
| EmptyCart | 0 | 5 | Baixa |
| PaymentLoading | 0 | 7 | Baixa |
| SignInToAccess | 0 | 2 | Baixa |
| Error | 0 | 4 | Baixa |

---

## 90 Core/Shared Components (`core/components/`)

| # | Componente | Sub-componentes internos |
|---|-----------|--------------------------|
| 1 | Accordion | — |
| 2 | AccountSettings | — |
| 3 | ActionBarSticky | — |
| 4 | ActionButtonSkeleton | — |
| 5 | AddressAutocomplete | AddressAutocompleteItem, AddressAutocompleteEmptyList, AutocompleteList.skeleton |
| 6 | AlssportsTermsAndConditions | — |
| 7 | AppBreadcrumb | — |
| 8 | Card | — |
| 9 | CartListGroupCheckbox | — |
| 10 | CartMultiDeliveryDrawer | CartMultiDeliveryDrawerContent, CartMultiDeliveryDrawerFooter, CartMultiDeliveryDrawerHeader |
| 11 | CartOptionsDrawer | (sub-components/) |
| 12 | CartSummary | — |
| 13 | CheckboxForm | — |
| 14 | Comment | AddCommentDrawer |
| 15 | ConsumerInfoSummary | — |
| 16 | CostCenter | CostCenterList |
| 17 | CostCenterDrawer | — |
| 18 | CustomerInfoSummary | — |
| 19 | CustomerReview | — |
| 20 | CustomFieldsDrawer | CustomFieldsDrawerGenericError, CustomFieldsDrawerList, CustomFieldsDrawerListItem, CustomFieldsDrawerSearch, CustomFieldsDrawerSkeleton |
| 21 | CustomFieldSelect | — |
| 22 | DatePickerInput | — |
| 23 | DeliveryDrawer | DeliveryDrawerContent, DeliveryDrawerHeader |
| 24 | DeliverySelectedAddress | — |
| 25 | Disclosure | — |
| 26 | Drawer | — |
| 27 | DrawerErrorBoundary | — |
| 28 | DrawerSearchInputContainer | — |
| 29 | DrawerV2 | — |
| 30 | DynamicFieldRender | — |
| 31 | DynamicFields | (components/) |
| 32 | ErrorBoundary | — |
| 33 | ErrorLayout | — |
| 34 | EstimateDate | — |
| 35 | ExtensionPoint | ExtensionPointErrorBoundary |
| 36 | FadeInTransition | — |
| 37 | Footer | — |
| 38 | Header | HeaderBackButton, HeaderLogo, Header.skeleton |
| 39 | IdentifySentryUser | — |
| 40 | InformationForm | InformationFormUSA |
| 41 | Intl (IntlProvider) | — |
| 42 | IphoneHead | — |
| 43 | ItemsListDrawer | ItemsListDrawerContent, ItemsListDrawerHeader |
| 44 | Layout | LayoutCenteredBlock, LayoutContent, LayoutFooter, LayoutHeader, LayoutSidebar, LayoutSidebarContextualActions, LayoutSidebarItem, LayoutSidebarItemHeader, LayoutToaster |
| 45 | LoginDrawer | LoginDrawerWithAccessKey, LoginDrawerWithPassword |
| 46 | LoginWithTokenDrawer | — |
| 47 | MainGridLayout | — |
| 48 | MiniCartList | MiniCartListItem, MiniCartListUnavailableItem |
| 49 | MiniCartListMultidelivery | GroupHeader, GroupTitle, Item, OptionsGroup, OptionsGroupDelivery, OptionsGroupPickup, UnavailableItem |
| 50 | MiniCartListSingleDelivery | MiniCartListItem, MiniCartListProductItem, MiniCartListProductItemInfo, MiniCartListUnavailableItem |
| 51 | OrderSummaryMobile | OrderSummaryMobileTopBar, OrderSummaryMobileTopBarV2 |
| 52 | OrganizationAuthGuard | — |
| 53 | OrganizationInfo | — |
| 54 | OrganizationInfoSummary | — |
| 55 | PackagesButton | — |
| 56 | PackagesDrawer | PackageItem, PackageItemsWrapper |
| 57 | PhoneNumberInput | (phone-masks) |
| 58 | PickupAddressDrawer | NoSlasPickup, PickupAddressDrawerTitle, PickupCard, PickupOptions |
| 59 | PickupPackagesDrawer | — |
| 60 | PlaceOrderErrorDrawer | — |
| 61 | ProductItem | ProductItemAfterFooterExtensionPoint, ProductItemCheckbox, ProductItemCompositionCount, ProductItemCostCenter, ProductItemDescription, ProductItemImage, ProductItemImageWrapper, ProductItemQuantityBadge, ProductItemSellerInfo, ProductItemSeparator, ProductItemSpecifications, ProductItemTagItem, ProductItemTags |
| 62 | ProductShippingOptionsDrawer | CurrentShippingOption |
| 63 | QuantitySelect | — |
| 64 | QuantitySelectContainer | QuantitySelectContainer.skeleton |
| 65 | QuantitySelectInput | — |
| 66 | RadioForm | — |
| 67 | RecipientDetailsForm | — |
| 68 | RemoveButton | — |
| 69 | ReviewItemsDrawerForMobile | — |
| 70 | SavedAddressesDrawer | EmptySavedAddressesList, SavedAddressesCard, SavedAddressesGenericError, SavedAddressesList, SavedAddressListSkeleton |
| 71 | ScrollableList | — |
| 72 | SelectForAllCostCenter | — |
| 73 | ShippingOptionEstimateDate | — |
| 74 | ShippingPackageDrawer | — |
| 75 | ShippingSinglePackageDrawer | — |
| 76 | SidebarItemSkeleton | — |
| 77 | Signin | (components/) |
| 78 | SimulatedShippingOption | CurrentShippingOption, SimulatedDeliveryOption, SimulatedDeliveryOptionFallback, SimulatedItemAvailability, SimulatedPickupOption, SimulatedPickupOptionFallback, SimulatedShippingOptionEstimateDate |
| 79 | Skeleton | — |
| 80 | SkeletonText | — |
| 81 | Summary | GiftCardTotalizers, ShippingTotalizerItem, TotalizerItem |
| 82 | TextInputForm | — |
| 83 | ThirdPartyScripts | ActivityFlow, GoogleTagManager, RecaptchaV3, SmartLook |
| 84 | TimePickerInput | TimePickerInputOptionLabel |
| 85 | ToastBar | ToastBarActionButton, ToastBarDismissButton |
| 86 | Tooltip | — |
| 87 | USADeliveryAddressForm | USADeliveryAddressFormMultidelivery, (components/, utils/) |
| 88 | ValidationQueueContext | — |
| 89 | WarningStatusBadge | — |
| 90 | CartListSkeleton | — |

---

## Componentes por Tela

### 1. Cart Screen (~45 componentes locais)

**Componentes locais:**

- `CartActionButton`
- `CartActionMobile` (+skeleton)
- `CartActionsGuard` (Provider + hook)
- `CartItem` (+skeleton)
- `CartItemUnavailable`
- `CartList` (deprecated)
- `CartListHeader`
- `CartListGroupedByDeliveryType` (+skeleton)
- `CartListMultidelivery` (+skeleton)
  - `CartListWithoutAddress`
  - `CartListByShippingOption`
  - `CartListGroup`
  - `AvailableItems`
  - `UnavailableItems`
  - `AddAddressMessage`
- `CartItemMultidelivery` (+skeleton)
- `CartAvailableItems`
  - `DeliveryAvailableItems`
  - `PickupAvailableItems`
- `CartScreenSummary`
- `Coupon`
  - `AddPromoCodeDrawer`
  - `PromoCodesList`
- `HearstTermsAndConditions`
- `OneClickMessageDrawer`
- `OneClickCheckoutOptions`
  - `ApplePayPlaceOrderButton`
  - `GooglePayOneClickCheckoutButton`
  - `ApplePayButton`
- `OneClickCheckoutCartActionsMobile`
- `RemoveAllButton`
- `SelectedDeliveryInformation`
  - `Delivery`
  - `Pickup`
- `ProductItemCompositions`
  - `CompositionItem`
- **Shipping/***
  - `ShippingChannelSelector`
  - `ShippingNewAddressDelivery`
  - `ShippingSavedAddressDelivery`
  - `ShippingMultiSlaDelivery`
  - `ShippingSingleSlaDelivery`
  - `ShippingPickupPreview`
  - `ShippingInfo`
  - `ShippingDates`
  - `ShippingPrice`
  - `ShippingContent`
  - `ShippingAddressDrawer`
  - `UserAddressLocation`
  - `ShippingAddressMultideliveryDrawer` (+Header, +Content)
  - `ShippingAddressSuggestion` (+Item, +EmptyList)

**Core components usados:**

`Layout*`, `Header*`, `Footer`, `Comment`, `ExtensionPoint`, `Summary`, `ProductItem*`, `QuantitySelectContainer`, `RemoveButton`, `WarningStatusBadge`, `EstimateDate`, `PackagesButton`, `PackagesDrawer`, `CostCenter`, `SelectForAllCostCenter`, `PickupAddressDrawer`, `Drawer`, `SkeletonText`, `ActionButtonSkeleton`, `SidebarItemSkeleton`, `Skeleton`

---

### 2. Delivery Screen (~50 componentes locais)

**Componentes locais:**

- `DeliveryContent`
- `DeliveryActionButton`
- `DeliveryScreenSummary`
- `DeliveryOrganizationInfo`
- `ShippingDeliveryMode`
  - `ShippingAddressSection`
  - `EditAddressButton`
  - `DeliveryAddressForm`
- `ShippingOptionsList`
  - `ShippingOptionSingleSla`
  - `ShippingOptionMultiSla`
  - `ShippingSummaryDrawer`
- `ShippingOptionItemsDrawer`
- `PickupDeliveryMode`
  - `ProductsAvailabilityDrawer`
    - `ProductsAvailableContent`
    - `ProductsAvailableList`
    - `ProductsAvailableHeader`
    - `ProductsUnavailableContent`
    - `ProductsUnavailableList`
- `PickupOptionItemsDrawer`
- `UnavailableItemsForPickup`
  - `ItemsToReview`
  - `ItemsToBeRemoved`
  - `ItemsToShipping`
- `ToggleDeliveryMode`
- `EmptyShipping`
- `ScheduledDeliverySection`
- `RecipientDetailsForm`
  - `RecipientInfoAutocomplete`
    - `RecipientInfoAutocompleteItem`
    - `RecipientInfoAutocompleteResults`
- `CustomFieldLocation`
  - `CustomFieldLocationList`
- `MultiDeliveryContent`
- `MultiDeliveryScreenSummary`
- `MultiDeliveryShippingOptionsGroup`
  - `DeliveryTo`
  - `MultideliveryDeliveryOption`
- `MultiDeliveryPickupOptionsGroup`
  - `MultiDeliveryPickupAddress`
  - `MultideliveryPickupOption`
- `MultiDeliveryActionButton` (Desktop + MobileAndTablet)
- `MultiDeliveryTitleCard`
- `ShippingActionsGuard` (Provider + hook)
- `ChangeDeliveryDrawer`
- `ShippingOptionsTo`
- `ShippingAvailableProducts`
- `ShippingUnavailableProducts`
- `AvailableItem`
- `UnavailableItem`

**Core components usados:**

`Layout*`, `Header*`, `Footer`, `AppBreadcrumb`, `CartSummary`, `CustomerInfoSummary`, `ExtensionPoint`, `InformationForm`, `MiniCartList`, `MiniCartListSingleDelivery`, `OrderSummaryMobileTopBarV2`, `ReviewItemsDrawerForMobile`, `Signin`, `ValidationQueueContext`, `ActionBarSticky`, `Drawer`, `DeliverySelectedAddress`, `Disclosure`, `PackagesButton`, `PackagesDrawer`, `PickupAddressDrawer`, `PickupCard`, `SavedAddressesDrawer`, `PhoneNumberInput`, `TextInputForm`, `CustomFieldSelect`, `CustomFieldsDrawer*`, `DrawerErrorBoundary`, `WarningStatusBadge`, `SkeletonText`, `GiftCardTotalizer`, `TotalizerItem`

---

### 3. Payment Screen (~33 componentes locais)

**Componentes locais:**

- `PaymentMenu`
  - `PaymentOptionList`
  - `SavedCardList`
- `PaymentOptionItem`
  - `PaymentOptionItemCard`
  - `PaymentOptionItemCardInfo`
  - `PaymentOptionTitle`
  - `PaymentOptionMessage`
- `PaymentOptionItemContent`
- `CreditCardPaymentOptionItem`
- `SavedCardList`
  - `SavedCardItem`
    - `SavedCardWrapper`
    - `SavedCardContent`
  - `ExpiredCardItem`
- `GiftCardOption`
  - `GiftCardContent`
    - `AddGiftCard`
      - `ProviderSelectInputForm`
    - `SpecialGiftCardOption`
      - `SpecialGiftCardOptionItem`
    - `GiftCardList`
      - `GiftCardListItem`
- `PlaceOrderButton`
  - `GiftCardPlaceOrderButton`
  - `PaymentOptionPlaceOrderButton`
  - `GooglePayPlaceOrderButton`
  - `SavedCreditCardPlaceOrderButton`
    - `SavedCardDrawer`
    - `SavedCardDrawerContent`
    - `CvcInsertionStep`
    - `InstallmentList`
    - `InstallmentSelectionStep`
  - `PlaceOrdersPermissionDrawer`
- `PaymentPlaceOrderButton` (Desktop + MobileAndTablet)
- `CustomOrderFields`
  - `CustomOrderFieldsPoNumber`
  - `CustomOrderFieldsRelease`
- `BudgetCard`
- `DeliverySummary`
- `PickupSummary`
- `ShippingSummaryItem`
- `ShippingSummaryMultiDeliveryItem`
  - `MultiDeliverySummary`
    - `MultiDeliveryItem`
  - `PickupMultiDeliverySummary`
- `PaymentOrderSummary`
- `PaymentOrganizationInfo`
- `PaymentActionsGuard` (Provider + hook)
- `MobileHearstTermsAndConditions`

**Core components usados:**

`Layout*`, `Header*`, `Footer`, `AppBreadcrumb`, `CustomerInfoSummary`, `MiniCartList`, `MiniCartListSingleDelivery`, `OrderSummaryMobileTopBar`, `Summary`, `PackagesDrawer`, `ShippingSinglePackageDrawer`, `ShippingPackageDrawer`, `PickupPackagesDrawer`, `DeliverySelectedAddress`, `ShippingOptionEstimateDate`, `ActionBarSticky`, `ActionButtonSkeleton`, `Drawer`, `LoginDrawer`, `PlaceOrderErrorDrawer`, `ReviewItemsDrawerForMobile`, `ValidationQueueContext`, `ExtensionPoint`, `LayoutToaster`, `Skeleton`, `SidebarItemSkeleton`

---

### 4. Review Screen (~10 componentes locais)

**Componentes locais:**

- `DeliveryReview`
  - `DeliveryReviewHeader`
- `PaymentReview`
  - `PaymentReviewCreditCard`
  - `PaymentReviewPaymentOption`
- `PlaceOrderButtonWrapper`
- `ReviewItem`
  - `ReviewItemContent`
  - `ReviewItemHeader`
- `PickupReview`

**Core components usados:**

`Layout*`, `Header*`, `Footer`, `AppBreadcrumb`, `CartSummary`, `CustomerInfoSummary`, `CustomerReview`, `ExtensionPoint`, `MiniCartList`, `OrderSummaryMobileTopBar`, `Summary`, `PackagesDrawer`, `ShippingSinglePackageDrawer`, `DeliverySelectedAddress`, `PickupPackagesDrawer`, `ReviewItemsDrawerForMobile`, `AlssportsTermsAndConditions`, `LayoutToaster`

**Cross-screen imports:** `PlaceOrderButton` (de Payment), `PaymentActionsGuardProvider` (de Payment)

---

### 5. OrderPlaced Screen (~25 componentes locais)

**Componentes locais:**

- `OrderPlacedSummaryItem`
- `OrderPlacedCreditCard`
- `OrderPlacedCustomer`
- `OrderPlacedPickup`
- `OrderPlacedStatus`
  - `OrderStatusInformation`
  - `PendingAndApprovedTransactionStatusDescription`
  - `WaitingAuthorizationTransactionStatusDescription`
  - `DeniedOrderStatusDescription`
- `OrderPlacedPixPaymentMethod`
- `OrderPlacedGiftCard`
- `OrderPlacedPixError`
- `OrderPlacedPixPaymentStatus`
- `OrderPlacedShipping`
  - `ShippingContent`
  - `MultideliveryShippingContent`
- `OrderPlacedDeliveryInformation`
  - `PickupInformation`
  - `PickupAddress`
  - `ShippingInformation`
    - `SingleSlaDeliveryInformation`
    - `MultiSlaDeliveryInformation`
  - `ShippingAddress`
  - `MultideliveryInformation`
  - `RecipientInformation`
- `OrderPlacedCustomFieldsItem`
  - `OrderPlacedCustomFieldsValue`
- `OrderPlacedNotesPayable`
- `OrderPlacedPix`
- `OrderPlacedPixPaymentPending`
- `OrderPlacedPixQrCode`
- `OrderPlacedPixCopyToClipboardButton`
- `OrderPlacedPixInstructions`
- `OrderPlacedPixCountdown`

**Core components usados:**

`Layout*`, `Header*`, `Footer`, `ExtensionPoint`, `FadeInTransition`, `DeliverySelectedAddress`, `MiniCartListSingleDelivery`, `ProductItemSeparator`, `PhoneNumberInput` (phone-masks), `LayoutToaster`

**Cross-screen imports:** `BudgetCard` (de Payment)

---

### 6. CartMultiDelivery Screen (~10 componentes locais)

**Componentes locais:**

- `CartMultiDeliveryList`
- `CartListHeader`
- `CartMultiDeliveryItem`
- `SelectCostCenterDrawer`
  - `EmptySelectCostCenterList`
  - `SelectCostCenterListSkeleton`
- `SelectDeliveryMethodDrawer`
  - `DeliveryMethod`
- `SelectCostCenter`
- `SelectCostCenterForAll`
- `EditDeliveryMethod`

**Core components usados:**

`Layout*`, `Header*`, `Footer`, `ProductItemSeparator`, `CartMultiDeliveryDrawerFooter`, `SkeletonText`, `LayoutToaster`

**Cross-screen imports:** `CartActionsGuardProvider` (de Cart), `EmptyCartScreen` (de EmptyCart)

---

### 7. CartPunchout Screen (~8 componentes locais)

**Componentes locais:**

- `CartPunchoutList`
- `CartPunchoutListHeader`
- `CartPunchoutItem` (+skeleton)
- `CartPunchoutItemUnavailable`
- `CartPunchoutActionMobile` (+skeleton)
- `CartPunchoutActionsGuard` (Provider)
- `PunchoutShippingAddress`
- `PunchoutShippingAddressSection`

**Core components usados:**

`Layout*`, `Header*`, `Footer`, `Comment`, `ExtensionPoint`, `Summary`, `ProductItem*` (13 sub-componentes), `WarningStatusBadge`, `QuantitySelectContainer`, `RemoveButton`, `CostCenter`, `SelectForAllCostCenter`, `SkeletonText`, `Skeleton`, `LayoutToaster`

---

### 8. EmptyCart Screen (0 componentes locais)

**Core components usados:**

`ExtensionPoint`, `Footer`, `Header`, `HeaderLogo`, `LayoutFooter`

---

### 9. PaymentLoading Screen (0 componentes locais)

**Core components usados:**

`FadeInTransition`, `Header`, `HeaderLogo`, `Layout`, `LayoutCenteredBlock`, `LayoutContent`, `LayoutHeader`

---

### 10. SignInToAccess Screen (0 componentes locais)

**Core components usados:**

`Header`, `HeaderLogo`

---

### 11. Error Screen (0 componentes locais)

**Core components usados:**

`ErrorLayout`, `Header`, `HeaderLogo`, `LayoutHeader`

---

## Core Components mais reutilizados

Componentes shared presentes em **todas ou quase todas** as telas:

| Componente | Telas que usam |
|------------|----------------|
| `Layout*` | Cart, Delivery, Payment, Review, OrderPlaced, CartMultiDelivery, CartPunchout, PaymentLoading |
| `Header` / `HeaderLogo` | Todas (11/11) |
| `Footer` | Cart, Delivery, Payment, Review, OrderPlaced, CartMultiDelivery, CartPunchout, EmptyCart |
| `ExtensionPoint` | Cart, Delivery, Payment, Review, OrderPlaced, CartPunchout, EmptyCart |
| `LayoutToaster` | Cart, Delivery, Payment, Review, OrderPlaced, CartMultiDelivery, CartPunchout |
| `ProductItem*` | Cart, CartPunchout, OrderPlaced |
| `Drawer` | Cart, Delivery, Payment |
| `DeliverySelectedAddress` | Delivery, Payment, Review, OrderPlaced |
| `MiniCartList*` | Delivery, Payment, Review |
| `Summary` | Cart, Payment, CartPunchout |
| `PackagesDrawer` | Delivery, Payment, Review |
| `CustomerInfoSummary` | Delivery, Payment, Review |
| `AppBreadcrumb` | Delivery, Payment, Review |
| `ReviewItemsDrawerForMobile` | Delivery, Payment, Review |
| `ValidationQueueContext` | Delivery, Payment |
| `ActionBarSticky` | Delivery, Payment |
| `WarningStatusBadge` | Cart, Delivery, CartPunchout |
| `SkeletonText` | Cart, Delivery, CartMultiDelivery, CartPunchout |
