/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: 'Red', Size: '42'
   * }
   * ```
   */
  ActiveVariations: { input: any; output: any }
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: [
   *     {
   *       src: "https://storecomponents.vtexassets.com/...",
   *       alt: "...",
   *       label: "...",
   *       value: "..."
   *     },
   *     {
   *       src: "https://storecomponents.vtexassets.com/...",
   *       alt: "...",
   *       label: "...",
   *       value: "..."
   *     }
   *   ],
   *   Size: [
   *     {
   *       src: "https://storecomponents.vtexassets.com/...",
   *       alt: "...",
   *       label: "...",
   *       value: "..."
   *     }
   *   ]
   * }
   * ```
   */
  FormattedVariants: { input: any; output: any }
  ObjectOrString: { input: any; output: any }
  /**
   * Example:
   *
   * ```json
   * {
   *   'Color-Red-Size-40': 'classic-shoes-37'
   * }
   * ```
   */
  SlugsMap: { input: any; output: any }
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: [ "Red", "Blue", "Green" ],
   *   Size: [ "40", "41" ]
   * }
   * ```
   */
  VariantsByName: { input: any; output: any }
}

/** Address information. */
export type Address = {
  /** Address city */
  city: Maybe<Scalars['String']['output']>
  /** Address complement */
  complement: Maybe<Scalars['String']['output']>
  /** Address country */
  country: Maybe<Scalars['String']['output']>
  /** Address geoCoordinates */
  geoCoordinates: Maybe<Array<Maybe<Scalars['Float']['output']>>>
  /** Address neighborhood */
  neighborhood: Maybe<Scalars['String']['output']>
  /** Address number */
  number: Maybe<Scalars['String']['output']>
  /** Address postal code */
  postalCode: Maybe<Scalars['String']['output']>
  /** Address reference */
  reference: Maybe<Scalars['String']['output']>
  /** Address state */
  state: Maybe<Scalars['String']['output']>
  /** Address street */
  street: Maybe<Scalars['String']['output']>
}

export type AvailableDeliveryWindows = {
  /** Available delivery window end date in UTC */
  endDateUtc: Maybe<Scalars['String']['output']>
  /** Available delivery window list price */
  listPrice: Maybe<Scalars['Int']['output']>
  /** Available delivery window price */
  price: Maybe<Scalars['Int']['output']>
  /** Available delivery window start date in UTC */
  startDateUtc: Maybe<Scalars['String']['output']>
  /** Available delivery window tax */
  tax: Maybe<Scalars['Int']['output']>
}

export type DeliveryIds = {
  /** DeliveryIds courier id */
  courierId: Maybe<Scalars['String']['output']>
  /** DeliveryIds courier name */
  courierName: Maybe<Scalars['String']['output']>
  /** DeliveryIds dock id */
  dockId: Maybe<Scalars['String']['output']>
  /** DeliveryIds quantity */
  quantity: Maybe<Scalars['Int']['output']>
  /** DeliveryIds warehouse id */
  warehouseId: Maybe<Scalars['String']['output']>
}

export type IGeoCoordinates = {
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float']['input']
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float']['input']
}

/** Person data input to the newsletter. */
export type IPersonNewsletter = {
  /** Person's email. */
  email: Scalars['String']['input']
  /** Person's name. */
  name: Scalars['String']['input']
}

/** Shipping Simulation item input. */
export type IShippingItem = {
  /** ShippingItem ID / Sku. */
  id: Scalars['String']['input']
  /** Number of items. */
  quantity: Scalars['Int']['input']
  /** Seller responsible for the ShippingItem. */
  seller: Scalars['String']['input']
}

/** Shopping cart input. */
export type IStoreCart = {
  /** Order information, including `orderNumber`, `acceptedOffer` and `shouldSplitItem`. */
  order: IStoreOrder
}

export type IStoreCurrency = {
  /** Currency code (e.g: USD). */
  code: Scalars['String']['input']
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String']['input']
}

export type IStoreDeliveryMode = {
  /** The delivery channel information of the session. */
  deliveryChannel: Scalars['String']['input']
  /** The delivery method information of the session. */
  deliveryMethod: Scalars['String']['input']
  /** The delivery window information of the session. */
  deliveryWindow: InputMaybe<IStoreDeliveryWindow>
}

/** Delivery window information. */
export type IStoreDeliveryWindow = {
  /** The delivery window end date information. */
  endDate: Scalars['String']['input']
  /** The delivery window start date information. */
  startDate: Scalars['String']['input']
}

export type IStoreGeoCoordinates = {
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float']['input']
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float']['input']
}

/** Image input. */
export type IStoreImage = {
  /** Alias for the input image. */
  alternateName: Scalars['String']['input']
  /** Keyword for the image. */
  keywords: InputMaybe<Scalars['String']['input']>
  /** Image input URL. */
  url: Scalars['String']['input']
}

/** Offer input. */
export type IStoreOffer = {
  /** Information on the item being offered. */
  itemOffered: IStoreProduct
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float']['input']
  /** Also known as spot price. */
  price: Scalars['Float']['input']
  /** Number of items offered. */
  quantity: Scalars['Int']['input']
  /** Seller responsible for the offer. */
  seller: IStoreOrganization
}

/** Order input. */
export type IStoreOrder = {
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<IStoreOffer>
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String']['input']
  /** Indicates whether or not items with attachments should be split. */
  shouldSplitItem: InputMaybe<Scalars['Boolean']['input']>
}

/** Organization input. */
export type IStoreOrganization = {
  /** Organization ID. */
  identifier: Scalars['String']['input']
}

/** Client profile data. */
export type IStorePerson = {
  /** Client email. */
  email: Scalars['String']['input']
  /** Client last name. */
  familyName: Scalars['String']['input']
  /** Client first name. */
  givenName: Scalars['String']['input']
  /** Client ID. */
  id: Scalars['String']['input']
}

/** Product input. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type IStoreProduct = {
  /** Custom Product Additional Properties. */
  additionalProperty: InputMaybe<Array<IStorePropertyValue>>
  /** Array of product images. */
  image: Array<IStoreImage>
  /** Product name. */
  name: Scalars['String']['input']
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String']['input']
}

export type IStorePropertyValue = {
  /** Property name. */
  name: Scalars['String']['input']
  /** Property id. This propert changes according to the content of the object. */
  propertyID: InputMaybe<Scalars['String']['input']>
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString']['input']
  /** Specifies the nature of the value */
  valueReference: Scalars['String']['input']
}

/** Selected search facet input. */
export type IStoreSelectedFacet = {
  /** Selected search facet key. */
  key: Scalars['String']['input']
  /** Selected search facet value. */
  value: Scalars['String']['input']
}

/** Session input. */
export type IStoreSession = {
  /** Session input address type. */
  addressType: InputMaybe<Scalars['String']['input']>
  /** Session input channel. */
  channel: InputMaybe<Scalars['String']['input']>
  /** Session input country. */
  country: Scalars['String']['input']
  /** Session input currency. */
  currency: IStoreCurrency
  /** Session input delivery mode. */
  deliveryMode: InputMaybe<IStoreDeliveryMode>
  /** Session input geoCoordinates. */
  geoCoordinates: InputMaybe<IStoreGeoCoordinates>
  /** Session input locale. */
  locale: Scalars['String']['input']
  /** Session input person. */
  person: InputMaybe<IStorePerson>
  /** Session input postal code. */
  postalCode: InputMaybe<Scalars['String']['input']>
}

export type LogisticsInfo = {
  /** LogisticsInfo itemIndex. */
  itemIndex: Maybe<Scalars['String']['output']>
  /** LogisticsInfo selectedSla. */
  selectedSla: Maybe<Scalars['String']['output']>
  /** List of LogisticsInfo ShippingSLA. */
  slas: Maybe<Array<Maybe<ShippingSla>>>
}

/** Shipping Simulation Logistic Item. */
export type LogisticsItem = {
  /** LogisticsItem availability. */
  availability: Maybe<Scalars['String']['output']>
  /** LogisticsItem ID / Sku. */
  id: Maybe<Scalars['String']['output']>
  /** LogisticsItem listPrice. */
  listPrice: Maybe<Scalars['Int']['output']>
  /** LogisticsItem measurementUnit. */
  measurementUnit: Maybe<Scalars['String']['output']>
  /** LogisticsItem price. */
  price: Maybe<Scalars['Int']['output']>
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil: Maybe<Scalars['String']['output']>
  /** Number of items. */
  quantity: Maybe<Scalars['Int']['output']>
  requestIndex: Maybe<Scalars['Int']['output']>
  /** LogisticsItem rewardValue. */
  rewardValue: Maybe<Scalars['Int']['output']>
  /** Seller responsible for the ShippingItem. */
  seller: Maybe<Scalars['String']['output']>
  /** List of Sellers. */
  sellerChain: Maybe<Array<Maybe<Scalars['String']['output']>>>
  /** LogisticsItem sellingPrice. */
  sellingPrice: Maybe<Scalars['Int']['output']>
  /** LogisticsItem tax. */
  tax: Maybe<Scalars['Int']['output']>
  /** LogisticsItem unitMultiplier. */
  unitMultiplier: Maybe<Scalars['Int']['output']>
}

export type MessageFields = {
  /** MessageFields ean. */
  ean: Maybe<Scalars['String']['output']>
  /** MessageFields item index. */
  itemIndex: Maybe<Scalars['String']['output']>
  /** MessageFields sku name. */
  skuName: Maybe<Scalars['String']['output']>
}

export type MessageInfo = {
  /** MessageInfo code. */
  code: Maybe<Scalars['String']['output']>
  /** MessageInfo fields. */
  fields: Maybe<MessageFields>
  /** MessageInfo status. */
  status: Maybe<Scalars['String']['output']>
  /** MessageInfo text. */
  text: Maybe<Scalars['String']['output']>
}

export type Mutation = {
  /** Subscribes a new person to the newsletter list. */
  subscribeToNewsletter: Maybe<PersonNewsletter>
  /** Checks for changes between the cart presented in the UI and the cart stored in the ecommerce platform. If changes are detected, it returns the cart stored on the platform. Otherwise, it returns `null`. */
  validateCart: Maybe<StoreCart>
  /** Updates a web session with the specified values. */
  validateSession: Maybe<StoreSession>
}

export type MutationSubscribeToNewsletterArgs = {
  data: IPersonNewsletter
}

export type MutationValidateCartArgs = {
  cart: IStoreCart
  session: InputMaybe<IStoreSession>
}

export type MutationValidateSessionArgs = {
  search: Scalars['String']['input']
  session: IStoreSession
}

/** Newsletter information. */
export type PersonNewsletter = {
  /** Person's ID in the newsletter list. */
  id: Scalars['String']['output']
}

export type PickupAddress = {
  /** PickupAddress address id. */
  addressId: Maybe<Scalars['String']['output']>
  /** PickupAddress address type. */
  addressType: Maybe<Scalars['String']['output']>
  /** PickupAddress city. */
  city: Maybe<Scalars['String']['output']>
  /** PickupAddress complement. */
  complement: Maybe<Scalars['String']['output']>
  /** PickupAddress country. */
  country: Maybe<Scalars['String']['output']>
  /** PickupAddress geo coordinates. */
  geoCoordinates: Maybe<Array<Maybe<Scalars['Float']['output']>>>
  /** PickupAddress neighborhood. */
  neighborhood: Maybe<Scalars['String']['output']>
  /** PickupAddress number. */
  number: Maybe<Scalars['String']['output']>
  /** PickupAddress postal code. */
  postalCode: Maybe<Scalars['String']['output']>
  /** PickupAddress receiver name. */
  receiverName: Maybe<Scalars['String']['output']>
  /** PickupAddress reference. */
  reference: Maybe<Scalars['String']['output']>
  /** PickupAddress state. */
  state: Maybe<Scalars['String']['output']>
  /** PickupAddress street. */
  street: Maybe<Scalars['String']['output']>
}

export type PickupStoreInfo = {
  /** PickupStoreInfo additional information. */
  additionalInfo: Maybe<Scalars['String']['output']>
  /** PickupStoreInfo address. */
  address: Maybe<PickupAddress>
  /** PickupStoreInfo dock id. */
  dockId: Maybe<Scalars['String']['output']>
  /** PickupStoreInfo friendly name. */
  friendlyName: Maybe<Scalars['String']['output']>
  /** Information if the store has pickup enable. */
  isPickupStore: Maybe<Scalars['Boolean']['output']>
}

export type Query = {
  /** Returns information about all collections. */
  allCollections: StoreCollectionConnection
  /** Returns information about all products. */
  allProducts: StoreProductConnection
  /** Returns the details of a collection based on the collection slug. */
  collection: StoreCollection
  /** Returns the details of a product based on the specified locator. */
  product: StoreProduct
  /** Returns if there's a redirect for a search. */
  redirect: Maybe<StoreRedirect>
  /** Returns the result of a product, facet, or suggestion search. */
  search: StoreSearchResult
  /** Returns a list of sellers available for a specific localization. */
  sellers: Maybe<SellersData>
  /** Returns information about shipping simulation. */
  shipping: Maybe<ShippingData>
}

export type QueryAllCollectionsArgs = {
  after: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type QueryAllProductsArgs = {
  after: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
}

export type QueryCollectionArgs = {
  slug: Scalars['String']['input']
}

export type QueryProductArgs = {
  locator: Array<IStoreSelectedFacet>
}

export type QueryRedirectArgs = {
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet>>
  term: InputMaybe<Scalars['String']['input']>
}

export type QuerySearchArgs = {
  after: InputMaybe<Scalars['String']['input']>
  first: Scalars['Int']['input']
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet>>
  sort?: InputMaybe<StoreSort>
  term?: InputMaybe<Scalars['String']['input']>
}

export type QuerySellersArgs = {
  country: Scalars['String']['input']
  geoCoordinates: InputMaybe<IGeoCoordinates>
  postalCode: InputMaybe<Scalars['String']['input']>
  salesChannel: InputMaybe<Scalars['String']['input']>
}

export type QueryShippingArgs = {
  country: Scalars['String']['input']
  items: Array<IShippingItem>
  postalCode: Scalars['String']['input']
}

/** Search result. */
export type SearchMetadata = {
  /** Indicates how the search engine corrected the misspelled word by using fuzzy logic. */
  fuzzy: Scalars['String']['output']
  /** Indicates if the search term was misspelled. */
  isTermMisspelled: Scalars['Boolean']['output']
  /** Logical operator used to run the search. */
  logicalOperator: Scalars['String']['output']
}

/** Information of sellers. */
export type SellerInfo = {
  /** Identification of the seller */
  id: Maybe<Scalars['String']['output']>
  /** Logo of the seller */
  logo: Maybe<Scalars['String']['output']>
  /** Name of the seller */
  name: Maybe<Scalars['String']['output']>
}

/** Regionalization with sellers information. */
export type SellersData = {
  /** Identification of region. */
  id: Maybe<Scalars['String']['output']>
  /** List of sellers. */
  sellers: Maybe<Array<Maybe<SellerInfo>>>
}

/** Shipping Simulation information. */
export type ShippingData = {
  /** Address information. */
  address: Maybe<Address>
  /** List of LogisticsItem. */
  items: Maybe<Array<Maybe<LogisticsItem>>>
  /** List of LogisticsInfo. */
  logisticsInfo: Maybe<Array<Maybe<LogisticsInfo>>>
  /** List of MessageInfo. */
  messages: Maybe<Array<Maybe<MessageInfo>>>
}

export type ShippingSla = {
  /** ShippingSLA available delivery windows. */
  availableDeliveryWindows: Maybe<Array<Maybe<AvailableDeliveryWindows>>>
  /** ShippingSLA carrier. */
  carrier: Maybe<Scalars['String']['output']>
  /** ShippingSLA delivery channel. */
  deliveryChannel: Maybe<Scalars['String']['output']>
  /** List of ShippingSLA delivery ids. */
  deliveryIds: Maybe<Array<Maybe<DeliveryIds>>>
  /** ShippingSLA friendly name. */
  friendlyName: Maybe<Scalars['String']['output']>
  /** ShippingSLA id. */
  id: Maybe<Scalars['String']['output']>
  /**
   * ShippingSLA localized shipping estimate.
   * Note: this will always return a localized string for locale `en-US`.
   */
  localizedEstimates: Maybe<Scalars['String']['output']>
  /** ShippingSLA name. */
  name: Maybe<Scalars['String']['output']>
  /** ShippingSLA pickup distance. */
  pickupDistance: Maybe<Scalars['Float']['output']>
  /** ShippingSLA pickup point id. */
  pickupPointId: Maybe<Scalars['String']['output']>
  /** ShippingSLA pickup store info. */
  pickupStoreInfo: Maybe<PickupStoreInfo>
  /** ShippingSLA price. */
  price: Maybe<Scalars['Float']['output']>
  /** ShippingSLA shipping estimate. */
  shippingEstimate: Maybe<Scalars['String']['output']>
  /** ShippingSLA shipping estimate date. */
  shippingEstimateDate: Maybe<Scalars['String']['output']>
}

export type SkuVariants = {
  /** SKU property values for the current SKU. */
  activeVariations: Maybe<Scalars['ActiveVariations']['output']>
  /** All available options for each SKU variant property, indexed by their name. */
  allVariantsByName: Maybe<Scalars['VariantsByName']['output']>
  /**
   * Available options for each varying SKU property, taking into account the
   * `dominantVariantName` property. Returns all available options for the
   * dominant property, and only options that can be combined with its current
   * value for other properties.
   * If `dominantVariantName` is not present, the first variant will be
   * considered the dominant one.
   */
  availableVariations: Maybe<Scalars['FormattedVariants']['output']>
  /**
   * Maps property value combinations to their respective SKU's slug. Enables
   * us to retrieve the slug for the SKU that matches the currently selected
   * variations in O(1) time.
   * If `dominantVariantName` is not present, the first variant will be
   * considered the dominant one.
   */
  slugsMap: Maybe<Scalars['SlugsMap']['output']>
}

export type SkuVariantsAvailableVariationsArgs = {
  dominantVariantName: InputMaybe<Scalars['String']['input']>
}

export type SkuVariantsSlugsMapArgs = {
  dominantVariantName: InputMaybe<Scalars['String']['input']>
}

/** Aggregate offer information, for a given SKU that is available to be fulfilled by multiple sellers. */
export type StoreAggregateOffer = {
  /** Highest price among all sellers. */
  highPrice: Scalars['Float']['output']
  /** Lowest price among all sellers. */
  lowPrice: Scalars['Float']['output']
  /** Number of sellers selling this SKU. */
  offerCount: Scalars['Int']['output']
  /** Array with information on each available offer. */
  offers: Array<StoreOffer>
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String']['output']
}

/** Average rating, based on multiple ratings or reviews. */
export type StoreAggregateRating = {
  /** Value of the aggregate rating. */
  ratingValue: Scalars['Float']['output']
  /** Total number of ratings. */
  reviewCount: Scalars['Int']['output']
}

/** information about the author of a product review or rating. */
export type StoreAuthor = {
  /** Author name. */
  name: Scalars['String']['output']
}

/** Brand of a given product. */
export type StoreBrand = {
  /** Brand name. */
  name: Scalars['String']['output']
}

/** List of items consisting of chain linked web pages, ending with the current page. */
export type StoreBreadcrumbList = {
  /** Array with breadcrumb elements. */
  itemListElement: Array<StoreListItem>
  /** Number of breadcrumbs in the list. */
  numberOfItems: Scalars['Int']['output']
}

/** Shopping cart information. */
export type StoreCart = {
  /** List of shopping cart messages. */
  messages: Array<StoreCartMessage>
  /** Order information, including `orderNumber` and `acceptedOffer`. */
  order: StoreOrder
}

/** Shopping cart message. */
export type StoreCartMessage = {
  /** Shopping cart message status, which can be `INFO`, `WARNING` or `ERROR`. */
  status: StoreStatus
  /** Shopping cart message text. */
  text: Scalars['String']['output']
}

/** Product collection information. */
export type StoreCollection = {
  /** List of items consisting of chain linked web pages, ending with the current page. */
  breadcrumbList: StoreBreadcrumbList
  /** Collection ID. */
  id: Scalars['ID']['output']
  /** Collection meta information. Used for search. */
  meta: StoreCollectionMeta
  /** Meta tag data. */
  seo: StoreSeo
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String']['output']
  /** Collection type. */
  type: StoreCollectionType
}

/** Collection connections, including pagination information and collections returned by the query. */
export type StoreCollectionConnection = {
  /** Array with collection connection page edges, each containing a collection and a corresponding cursor.. */
  edges: Array<StoreCollectionEdge>
  /** Collection pagination information. */
  pageInfo: StorePageInfo
}

/** Each collection edge contains a `node`, with product collection information, and a `cursor`, that can be used as a reference for pagination. */
export type StoreCollectionEdge = {
  /** Collection cursor. Used as pagination reference. */
  cursor: Scalars['String']['output']
  /** Each collection node contains the information of a product collection returned by the query. */
  node: StoreCollection
}

/** Product collection facet, used for search. */
export type StoreCollectionFacet = {
  /** Facet key. */
  key: Scalars['String']['output']
  /** Facet value. */
  value: Scalars['String']['output']
}

/** Collection meta information. Used for search. */
export type StoreCollectionMeta = {
  /** List of selected collection facets. */
  selectedFacets: Array<StoreCollectionFacet>
}

/** Product collection type. Possible values are `Department`, `Category`, `Brand`, `Cluster`, `SubCategory` or `Collection`. */
export type StoreCollectionType =
  /** Product brand. */
  | 'Brand'
  /** Second level of product categorization. */
  | 'Category'
  /** Product cluster. */
  | 'Cluster'
  /** Product collection. */
  | 'Collection'
  /** First level of product categorization. */
  | 'Department'
  /** Third level of product categorization. */
  | 'SubCategory'

/** Currency information. */
export type StoreCurrency = {
  /** Currency code (e.g: USD). */
  code: Scalars['String']['output']
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String']['output']
}

/** Delivery mode information. */
export type StoreDeliveryMode = {
  /** The delivery channel information of the session. */
  deliveryChannel: Scalars['String']['output']
  /** The delivery method information of the session. */
  deliveryMethod: Scalars['String']['output']
  /** The delivery window information of the session. */
  deliveryWindow: Maybe<StoreDeliveryWindow>
}

/** Delivery window information. */
export type StoreDeliveryWindow = {
  /** The delivery window end date information. */
  endDate: Scalars['String']['output']
  /** The delivery window start date information. */
  startDate: Scalars['String']['output']
}

export type StoreFacet = StoreFacetBoolean | StoreFacetRange

/** Search facet boolean information. */
export type StoreFacetBoolean = {
  /** Facet key. */
  key: Scalars['String']['output']
  /** Facet label. */
  label: Scalars['String']['output']
  /** Array with information on each facet value. */
  values: Array<StoreFacetValueBoolean>
}

/** Search facet range information. */
export type StoreFacetRange = {
  /** Facet key. */
  key: Scalars['String']['output']
  /** Facet label. */
  label: Scalars['String']['output']
  /** Maximum facet range value. */
  max: StoreFacetValueRange
  /** Minimum facet range value. */
  min: StoreFacetValueRange
}

/** Search facet type. */
export type StoreFacetType =
  /** Indicates boolean search facet. */
  | 'BOOLEAN'
  /** Indicates range type search facet. */
  | 'RANGE'

/** Information of a specific facet value. */
export type StoreFacetValueBoolean = {
  /** Facet value label. */
  label: Scalars['String']['output']
  /** Number of items with this facet. */
  quantity: Scalars['Int']['output']
  /** Indicates whether facet is selected. */
  selected: Scalars['Boolean']['output']
  /** Facet value. */
  value: Scalars['String']['output']
}

/** Search facet range value information. Used for minimum and maximum range values. */
export type StoreFacetValueRange = {
  /** Search facet range absolute value. */
  absolute: Scalars['Float']['output']
  /** Search facet range selected value. */
  selected: Scalars['Float']['output']
}

/** Geographic coordinates information. */
export type StoreGeoCoordinates = {
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float']['output']
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float']['output']
}

/** Image. */
export type StoreImage = {
  /** Alias for the image. */
  alternateName: Scalars['String']['output']
  /** Keyword for the image. */
  keywords: Maybe<Scalars['String']['output']>
  /** Image URL. */
  url: Scalars['String']['output']
}

/** Item of a list. */
export type StoreListItem = {
  /** List item value. */
  item: Scalars['String']['output']
  /** Name of the list item. */
  name: Scalars['String']['output']
  /** Position of the item in the list. */
  position: Scalars['Int']['output']
}

/** Offer information. */
export type StoreOffer = {
  /** Offer item availability. */
  availability: Scalars['String']['output']
  /** Offer item condition. */
  itemCondition: Scalars['String']['output']
  /** Information on the item being offered. */
  itemOffered: StoreProduct
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float']['output']
  /** Also known as spot price. */
  price: Scalars['Float']['output']
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String']['output']
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil: Scalars['String']['output']
  /** Number of items offered. */
  quantity: Scalars['Int']['output']
  /** Seller responsible for the offer. */
  seller: StoreOrganization
  /** Computed price before applying coupons, taxes or benefits. This may change before it reaches the shelf. */
  sellingPrice: Scalars['Float']['output']
}

/** Information of a specific order. */
export type StoreOrder = {
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<StoreOffer>
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String']['output']
}

/** Organization. */
export type StoreOrganization = {
  /** Organization ID. */
  identifier: Scalars['String']['output']
}

/** Whenever you make a query that allows for pagination, such as `allProducts` or `allCollections`, you can check `StorePageInfo` to learn more about the complete set of items and use it to paginate your queries. */
export type StorePageInfo = {
  /** Cursor corresponding to the last possible item. */
  endCursor: Scalars['String']['output']
  /** Indicates whether there is at least one more page with items after the ones returned in the current query. */
  hasNextPage: Scalars['Boolean']['output']
  /** Indicates whether there is at least one more page with items before the ones returned in the current query. */
  hasPreviousPage: Scalars['Boolean']['output']
  /** Cursor corresponding to the first possible item. */
  startCursor: Scalars['String']['output']
  /** Total number of items (products or collections), not pages. */
  totalCount: Scalars['Int']['output']
}

/** Client profile data. */
export type StorePerson = {
  /** Client email. */
  email: Scalars['String']['output']
  /** Client last name. */
  familyName: Scalars['String']['output']
  /** Client first name. */
  givenName: Scalars['String']['output']
  /** Client ID. */
  id: Scalars['String']['output']
}

/** Product information. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProduct = {
  /** Array of additional properties. */
  additionalProperty: Array<StorePropertyValue>
  /** Aggregate ratings data. */
  aggregateRating: StoreAggregateRating
  /** Product brand. */
  brand: StoreBrand
  /** List of items consisting of chain linked web pages, ending with the current page. */
  breadcrumbList: StoreBreadcrumbList
  /** Product description. */
  description: Scalars['String']['output']
  /** Global Trade Item Number. */
  gtin: Scalars['String']['output']
  /** Array of images. */
  image: Array<StoreImage>
  /** Indicates product group related to this product. */
  isVariantOf: StoreProductGroup
  /** Product name. */
  name: Scalars['String']['output']
  /** Aggregate offer information. */
  offers: StoreAggregateOffer
  /** Product ID, such as [ISBN](https://www.isbn-international.org/content/what-isbn) or similar global IDs. */
  productID: Scalars['String']['output']
  /** The product's release date. Formatted using https://en.wikipedia.org/wiki/ISO_8601 */
  releaseDate: Scalars['String']['output']
  /** Array with review information. */
  review: Array<StoreReview>
  /** Meta tag data. */
  seo: StoreSeo
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String']['output']
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String']['output']
}

/** Product information. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProductImageArgs = {
  count?: InputMaybe<Scalars['Int']>
  keywords?: InputMaybe<Scalars['String']>
}

/** Product connections, including pagination information and products returned by the query. */
export type StoreProductConnection = {
  /** Array with product connection edges, each containing a product and a corresponding cursor. */
  edges: Array<StoreProductEdge>
  /** Product pagination information. */
  pageInfo: StorePageInfo
}

/** Each product edge contains a `node`, with product information, and a `cursor`, that can be used as a reference for pagination. */
export type StoreProductEdge = {
  /** Product cursor. Used as pagination reference. */
  cursor: Scalars['String']['output']
  /** Each product node contains the information of a product returned by the query. */
  node: StoreProduct
}

/** Product group information. Product groups are catalog entities that may contain variants. They are equivalent to VTEX [Products](https://help.vtex.com/en/tutorial/what-is-a-product--2zrB2gFCHyQokCKKE8kuAw#), whereas each variant is equivalent to a VTEX [SKU](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProductGroup = {
  /** Array of additional properties. */
  additionalProperty: Array<StorePropertyValue>
  /** Array of variants related to product group. Variants are equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). */
  hasVariant: Array<StoreProduct>
  /** Product group name. */
  name: Scalars['String']['output']
  /** Product group ID. */
  productGroupID: Scalars['String']['output']
  /**
   * Object containing data structures to facilitate handling different SKU
   * variant properties. Specially useful for implementing SKU selection
   * components.
   */
  skuVariants: Maybe<SkuVariants>
}

/** Properties that can be associated with products and products groups. */
export type StorePropertyValue = {
  /** Property name. */
  name: Scalars['String']['output']
  /** Property id. This propert changes according to the content of the object. */
  propertyID: Scalars['String']['output']
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString']['output']
  /** Specifies the nature of the value */
  valueReference: Scalars['String']['output']
}

/**
 * Redirect informations, including url returned by the query.
 * https://schema.org/Thing
 */
export type StoreRedirect = {
  /** URL to redirect */
  url: Maybe<Scalars['String']['output']>
}

/** Information of a given review. */
export type StoreReview = {
  /** Review author. */
  author: StoreAuthor
  /** Review rating information. */
  reviewRating: StoreReviewRating
}

/** Information of a given review rating. */
export type StoreReviewRating = {
  /** Best rating value. */
  bestRating: Scalars['Float']['output']
  /** Rating value. */
  ratingValue: Scalars['Float']['output']
}

/** Search result. */
export type StoreSearchResult = {
  /** Array of search result facets. */
  facets: Array<StoreFacet>
  /** Search result metadata. Additional data can be used to send analytics events. */
  metadata: Maybe<SearchMetadata>
  /** Search result products. */
  products: StoreProductConnection
  /** Search result suggestions. */
  suggestions: StoreSuggestions
}

/** Search Engine Optimization (SEO) tags data. */
export type StoreSeo = {
  /** Canonical tag. */
  canonical: Scalars['String']['output']
  /** Description tag. */
  description: Scalars['String']['output']
  /** Title tag. */
  title: Scalars['String']['output']
  /** Title template tag. */
  titleTemplate: Scalars['String']['output']
}

/** Session information. */
export type StoreSession = {
  /** Session address type. */
  addressType: Maybe<Scalars['String']['output']>
  /** Session channel. */
  channel: Maybe<Scalars['String']['output']>
  /** Session country. */
  country: Scalars['String']['output']
  /** Session currency. */
  currency: StoreCurrency
  /** Session delivery mode. */
  deliveryMode: Maybe<StoreDeliveryMode>
  /** Session input geoCoordinates. */
  geoCoordinates: Maybe<StoreGeoCoordinates>
  /** Session locale. */
  locale: Scalars['String']['output']
  /** Session input person. */
  person: Maybe<StorePerson>
  /** Session postal code. */
  postalCode: Maybe<Scalars['String']['output']>
}

/** Product search results sorting options. */
export type StoreSort =
  /** Sort by discount value, from highest to lowest. */
  | 'discount_desc'
  /** Sort by name, in alphabetical order. */
  | 'name_asc'
  /** Sort by name, in reverse alphabetical order. */
  | 'name_desc'
  /** Sort by orders, from highest to lowest. */
  | 'orders_desc'
  /** Sort by price, from lowest to highest. */
  | 'price_asc'
  /** Sort by price, from highest to lowest. */
  | 'price_desc'
  /** Sort by release date, from  highest to lowest. */
  | 'release_desc'
  /** Sort by product score, from highest to lowest. */
  | 'score_desc'

/** Status used to indicate a message type. For instance, a shopping cart informative or error message. */
export type StoreStatus = 'ERROR' | 'INFO' | 'WARNING'

/** Suggestion term. */
export type StoreSuggestionTerm = {
  /** Its occurrences count. */
  count: Scalars['Int']['output']
  /** The term. */
  value: Scalars['String']['output']
}

/** Suggestions information. */
export type StoreSuggestions = {
  /** Array with suggestion products' information. */
  products: Array<StoreProduct>
  /** Array with suggestion terms. */
  terms: Array<StoreSuggestionTerm>
}

export type ProductSummary_ProductFragment = {
  slug: string
  sku: string
  name: string
  gtin: string
  id: string
  brand: { name: string; brandName: string }
  isVariantOf: { productGroupID: string; name: string }
  image: Array<{ url: string; alternateName: string }>
  offers: {
    lowPrice: number
    offers: Array<{
      availability: string
      price: number
      listPrice: number
      quantity: number
      seller: { identifier: string }
    }>
  }
}

type Filter_Facets_StoreFacetBoolean_Fragment = {
  __typename: 'StoreFacetBoolean'
  key: string
  label: string
  values: Array<{
    label: string
    value: string
    selected: boolean
    quantity: number
  }>
}

type Filter_Facets_StoreFacetRange_Fragment = {
  __typename: 'StoreFacetRange'
  key: string
  label: string
  min: { selected: number; absolute: number }
  max: { selected: number; absolute: number }
}

export type Filter_FacetsFragment =
  | Filter_Facets_StoreFacetBoolean_Fragment
  | Filter_Facets_StoreFacetRange_Fragment

export type ProductDetailsFragment_ProductFragment = {
  sku: string
  name: string
  gtin: string
  description: string
  id: string
  isVariantOf: {
    name: string
    productGroupID: string
    skuVariants: {
      activeVariations: any | null
      slugsMap: any | null
      availableVariations: any | null
    } | null
  }
  image: Array<{ url: string; alternateName: string; keywords: string | null }>
  brand: { name: string }
  offers: {
    lowPrice: number
    offers: Array<{
      availability: string
      price: number
      listPrice: number
      seller: { identifier: string }
    }>
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: any
    valueReference: string
  }>
}

export type ClientManyProductsFragment = {
  search: { products: { pageInfo: { totalCount: number } } }
}

export type ClientProductFragment = { product: { id: string } }

export type ClientProductGalleryFragment = {
  search: { products: { pageInfo: { totalCount: number } } }
}

export type ClientSearchSuggestionsFragment = {
  search: { suggestions: { terms: Array<{ value: string }> } }
}

export type ClientShippingSimulationFragment = {
  shipping: { address: { city: string | null } | null } | null
}

export type ClientTopSearchSuggestionsFragment = {
  search: { suggestions: { terms: Array<{ value: string }> } }
}

export type ServerCollectionPageFragment = { collection: { id: string } }

export type ServerProductFragment = { product: { id: string } }

export type ServerCollectionPageQueryQueryVariables = Exact<{
  slug: Scalars['String']['input']
}>

export type ServerCollectionPageQueryQuery = {
  collection: {
    id: string
    seo: { title: string; description: string }
    breadcrumbList: {
      itemListElement: Array<{ item: string; name: string; position: number }>
    }
    meta: { selectedFacets: Array<{ key: string; value: string }> }
  }
}

export type ServerProductQueryQueryVariables = Exact<{
  locator: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type ServerProductQueryQuery = {
  product: {
    sku: string
    gtin: string
    name: string
    description: string
    releaseDate: string
    id: string
    seo: { title: string; description: string; canonical: string }
    brand: { name: string }
    breadcrumbList: {
      itemListElement: Array<{ item: string; name: string; position: number }>
    }
    image: Array<{
      url: string
      alternateName: string
      keywords: string | null
    }>
    offers: {
      lowPrice: number
      highPrice: number
      priceCurrency: string
      offers: Array<{
        availability: string
        price: number
        priceValidUntil: string
        priceCurrency: string
        itemCondition: string
        listPrice: number
        seller: { identifier: string }
      }>
    }
    isVariantOf: {
      productGroupID: string
      name: string
      skuVariants: {
        activeVariations: any | null
        slugsMap: any | null
        availableVariations: any | null
      } | null
    }
    additionalProperty: Array<{
      propertyID: string
      name: string
      value: any
      valueReference: string
    }>
  }
}

export type ValidateCartMutationMutationVariables = Exact<{
  cart: IStoreCart
  session: IStoreSession
}>

export type ValidateCartMutationMutation = {
  validateCart: {
    order: {
      orderNumber: string
      acceptedOffer: Array<{
        quantity: number
        price: number
        listPrice: number
        seller: { identifier: string }
        itemOffered: {
          sku: string
          name: string
          gtin: string
          image: Array<{
            url: string
            alternateName: string
            keywords: string | null
          }>
          brand: { name: string }
          isVariantOf: {
            productGroupID: string
            name: string
            skuVariants: {
              activeVariations: any | null
              slugsMap: any | null
              availableVariations: any | null
            } | null
          }
          additionalProperty: Array<{
            propertyID: string
            name: string
            value: any
            valueReference: string
          }>
        }
      }>
    }
    messages: Array<{ text: string; status: StoreStatus }>
  } | null
}

export type CartMessageFragment = { text: string; status: StoreStatus }

export type CartItemFragment = {
  quantity: number
  price: number
  listPrice: number
  seller: { identifier: string }
  itemOffered: {
    sku: string
    name: string
    gtin: string
    image: Array<{
      url: string
      alternateName: string
      keywords: string | null
    }>
    brand: { name: string }
    isVariantOf: {
      productGroupID: string
      name: string
      skuVariants: {
        activeVariations: any | null
        slugsMap: any | null
        availableVariations: any | null
      } | null
    }
    additionalProperty: Array<{
      propertyID: string
      name: string
      value: any
      valueReference: string
    }>
  }
}

export type CartProductItemFragment = {
  sku: string
  name: string
  gtin: string
  image: Array<{ url: string; alternateName: string; keywords: string | null }>
  brand: { name: string }
  isVariantOf: {
    productGroupID: string
    name: string
    skuVariants: {
      activeVariations: any | null
      slugsMap: any | null
      availableVariations: any | null
    } | null
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: any
    valueReference: string
  }>
}

export type SubscribeToNewsletterMutationVariables = Exact<{
  data: IPersonNewsletter
}>

export type SubscribeToNewsletterMutation = {
  subscribeToNewsletter: { id: string } | null
}

export type ClientManyProductsQueryQueryVariables = Exact<{
  first: Scalars['Int']['input']
  after: InputMaybe<Scalars['String']['input']>
  sort: StoreSort
  term: Scalars['String']['input']
  selectedFacets: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type ClientManyProductsQueryQuery = {
  search: {
    products: {
      pageInfo: { totalCount: number }
      edges: Array<{
        node: {
          slug: string
          sku: string
          name: string
          gtin: string
          id: string
          brand: { name: string; brandName: string }
          isVariantOf: { productGroupID: string; name: string }
          image: Array<{ url: string; alternateName: string }>
          offers: {
            lowPrice: number
            offers: Array<{
              availability: string
              price: number
              listPrice: number
              quantity: number
              seller: { identifier: string }
            }>
          }
        }
      }>
    }
  }
}

export type ClientProductGalleryQueryQueryVariables = Exact<{
  first: Scalars['Int']['input']
  after: Scalars['String']['input']
  sort: StoreSort
  term: Scalars['String']['input']
  selectedFacets: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type ClientProductGalleryQueryQuery = {
  search: {
    products: { pageInfo: { totalCount: number } }
    facets: Array<
      | {
          __typename: 'StoreFacetBoolean'
          key: string
          label: string
          values: Array<{
            label: string
            value: string
            selected: boolean
            quantity: number
          }>
        }
      | {
          __typename: 'StoreFacetRange'
          key: string
          label: string
          min: { selected: number; absolute: number }
          max: { selected: number; absolute: number }
        }
    >
    metadata: {
      isTermMisspelled: boolean
      logicalOperator: string
      fuzzy: string
    } | null
  }
}

export type SearchEvent_MetadataFragment = {
  isTermMisspelled: boolean
  logicalOperator: string
  fuzzy: string
}

export type ClientProductQueryQueryVariables = Exact<{
  locator: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type ClientProductQueryQuery = {
  product: {
    sku: string
    name: string
    gtin: string
    description: string
    id: string
    isVariantOf: {
      name: string
      productGroupID: string
      skuVariants: {
        activeVariations: any | null
        slugsMap: any | null
        availableVariations: any | null
      } | null
    }
    image: Array<{
      url: string
      alternateName: string
      keywords: string | null
    }>
    brand: { name: string }
    offers: {
      lowPrice: number
      offers: Array<{
        availability: string
        price: number
        listPrice: number
        seller: { identifier: string }
      }>
    }
    additionalProperty: Array<{
      propertyID: string
      name: string
      value: any
      valueReference: string
    }>
  }
}

export type ClientSearchSuggestionsQueryQueryVariables = Exact<{
  term: Scalars['String']['input']
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet> | IStoreSelectedFacet>
}>

export type ClientSearchSuggestionsQueryQuery = {
  search: {
    suggestions: {
      terms: Array<{ value: string }>
      products: Array<{
        slug: string
        sku: string
        name: string
        gtin: string
        id: string
        brand: { name: string; brandName: string }
        isVariantOf: { productGroupID: string; name: string }
        image: Array<{ url: string; alternateName: string }>
        offers: {
          lowPrice: number
          offers: Array<{
            availability: string
            price: number
            listPrice: number
            quantity: number
            seller: { identifier: string }
          }>
        }
      }>
    }
    products: { pageInfo: { totalCount: number } }
    metadata: {
      isTermMisspelled: boolean
      logicalOperator: string
      fuzzy: string
    } | null
  }
}

export type ClientTopSearchSuggestionsQueryQueryVariables = Exact<{
  term: Scalars['String']['input']
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet> | IStoreSelectedFacet>
}>

export type ClientTopSearchSuggestionsQueryQuery = {
  search: { suggestions: { terms: Array<{ value: string }> } }
}

export type ValidateSessionMutationVariables = Exact<{
  session: IStoreSession
  search: Scalars['String']['input']
}>

export type ValidateSessionMutation = {
  validateSession: {
    locale: string
    channel: string | null
    country: string
    addressType: string | null
    postalCode: string | null
    deliveryMode: {
      deliveryChannel: string
      deliveryMethod: string
      deliveryWindow: { startDate: string; endDate: string } | null
    } | null
    geoCoordinates: { latitude: number; longitude: number } | null
    currency: { code: string; symbol: string }
    person: {
      id: string
      email: string
      givenName: string
      familyName: string
    } | null
  } | null
}

export type ClientShippingSimulationQueryQueryVariables = Exact<{
  postalCode: Scalars['String']['input']
  country: Scalars['String']['input']
  items: Array<IShippingItem> | IShippingItem
}>

export type ClientShippingSimulationQueryQuery = {
  shipping: {
    logisticsInfo: Array<{
      slas: Array<{
        carrier: string | null
        price: number | null
        shippingEstimate: string | null
        localizedEstimates: string | null
        availableDeliveryWindows: Array<{
          startDateUtc: string | null
          endDateUtc: string | null
          price: number | null
          listPrice: number | null
        } | null> | null
      } | null> | null
    } | null> | null
    address: {
      city: string | null
      neighborhood: string | null
      state: string | null
    } | null
  } | null
}

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType']

  constructor(private value: string, public __meta__?: Record<string, any>) {
    super(value)
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value
  }
}
export const ProductSummary_ProductFragmentDoc = new TypedDocumentString(
  `
    fragment ProductSummary_product on StoreProduct {
  id: productID
  slug
  sku
  brand {
    brandName: name
  }
  name
  gtin
  isVariantOf {
    productGroupID
    name
  }
  image {
    url
    alternateName
  }
  brand {
    name
  }
  offers {
    lowPrice
    offers {
      availability
      price
      listPrice
      quantity
      seller {
        identifier
      }
    }
  }
}
    `,
  { fragmentName: 'ProductSummary_product' }
) as unknown as TypedDocumentString<ProductSummary_ProductFragment, unknown>
export const Filter_FacetsFragmentDoc = new TypedDocumentString(
  `
    fragment Filter_facets on StoreFacet {
  ... on StoreFacetRange {
    key
    label
    min {
      selected
      absolute
    }
    max {
      selected
      absolute
    }
    __typename
  }
  ... on StoreFacetBoolean {
    key
    label
    values {
      label
      value
      selected
      quantity
    }
    __typename
  }
}
    `,
  { fragmentName: 'Filter_facets' }
) as unknown as TypedDocumentString<Filter_FacetsFragment, unknown>
export const CartProductItemFragmentDoc = new TypedDocumentString(
  `
    fragment CartProductItem on StoreProduct {
  sku
  name
  image {
    url
    alternateName
    keywords
  }
  brand {
    name
  }
  isVariantOf {
    productGroupID
    name
    skuVariants {
      activeVariations
      slugsMap
      availableVariations
    }
  }
  gtin
  additionalProperty {
    propertyID
    name
    value
    valueReference
  }
}
    `,
  { fragmentName: 'CartProductItem' }
) as unknown as TypedDocumentString<CartProductItemFragment, unknown>
export const ProductDetailsFragment_ProductFragmentDoc =
  new TypedDocumentString(
    `
    fragment ProductDetailsFragment_product on StoreProduct {
  id: productID
  sku
  name
  gtin
  description
  isVariantOf {
    name
    productGroupID
    skuVariants {
      activeVariations
      slugsMap
      availableVariations
    }
  }
  image {
    url
    alternateName
  }
  brand {
    name
  }
  offers {
    lowPrice
    offers {
      availability
      price
      listPrice
      seller {
        identifier
      }
    }
  }
  ...CartProductItem
}
    fragment CartProductItem on StoreProduct {
  sku
  name
  image {
    url
    alternateName
    keywords
  }
  brand {
    name
  }
  isVariantOf {
    productGroupID
    name
    skuVariants {
      activeVariations
      slugsMap
      availableVariations
    }
  }
  gtin
  additionalProperty {
    propertyID
    name
    value
    valueReference
  }
}`,
    { fragmentName: 'ProductDetailsFragment_product' }
  ) as unknown as TypedDocumentString<
    ProductDetailsFragment_ProductFragment,
    unknown
  >
export const ClientManyProductsFragmentDoc = new TypedDocumentString(
  `
    fragment ClientManyProducts on Query {
  search(
    first: $first
    after: $after
    sort: $sort
    term: $term
    selectedFacets: $selectedFacets
  ) {
    products {
      pageInfo {
        totalCount
      }
    }
  }
}
    `,
  { fragmentName: 'ClientManyProducts' }
) as unknown as TypedDocumentString<ClientManyProductsFragment, unknown>
export const ClientProductFragmentDoc = new TypedDocumentString(
  `
    fragment ClientProduct on Query {
  product(locator: $locator) {
    id: productID
  }
}
    `,
  { fragmentName: 'ClientProduct' }
) as unknown as TypedDocumentString<ClientProductFragment, unknown>
export const ClientProductGalleryFragmentDoc = new TypedDocumentString(
  `
    fragment ClientProductGallery on Query {
  search(
    first: $first
    after: $after
    sort: $sort
    term: $term
    selectedFacets: $selectedFacets
  ) {
    products {
      pageInfo {
        totalCount
      }
    }
  }
}
    `,
  { fragmentName: 'ClientProductGallery' }
) as unknown as TypedDocumentString<ClientProductGalleryFragment, unknown>
export const ClientSearchSuggestionsFragmentDoc = new TypedDocumentString(
  `
    fragment ClientSearchSuggestions on Query {
  search(first: 5, term: $term, selectedFacets: $selectedFacets) {
    suggestions {
      terms {
        value
      }
    }
  }
}
    `,
  { fragmentName: 'ClientSearchSuggestions' }
) as unknown as TypedDocumentString<ClientSearchSuggestionsFragment, unknown>
export const ClientShippingSimulationFragmentDoc = new TypedDocumentString(
  `
    fragment ClientShippingSimulation on Query {
  shipping(items: $items, postalCode: $postalCode, country: $country) {
    address {
      city
    }
  }
}
    `,
  { fragmentName: 'ClientShippingSimulation' }
) as unknown as TypedDocumentString<ClientShippingSimulationFragment, unknown>
export const ClientTopSearchSuggestionsFragmentDoc = new TypedDocumentString(
  `
    fragment ClientTopSearchSuggestions on Query {
  search(first: 5, term: $term, selectedFacets: $selectedFacets) {
    suggestions {
      terms {
        value
      }
    }
  }
}
    `,
  { fragmentName: 'ClientTopSearchSuggestions' }
) as unknown as TypedDocumentString<ClientTopSearchSuggestionsFragment, unknown>
export const ServerCollectionPageFragmentDoc = new TypedDocumentString(
  `
    fragment ServerCollectionPage on Query {
  collection(slug: $slug) {
    id
  }
}
    `,
  { fragmentName: 'ServerCollectionPage' }
) as unknown as TypedDocumentString<ServerCollectionPageFragment, unknown>
export const ServerProductFragmentDoc = new TypedDocumentString(
  `
    fragment ServerProduct on Query {
  product(locator: $locator) {
    id: productID
  }
}
    `,
  { fragmentName: 'ServerProduct' }
) as unknown as TypedDocumentString<ServerProductFragment, unknown>
export const CartMessageFragmentDoc = new TypedDocumentString(
  `
    fragment CartMessage on StoreCartMessage {
  text
  status
}
    `,
  { fragmentName: 'CartMessage' }
) as unknown as TypedDocumentString<CartMessageFragment, unknown>
export const CartItemFragmentDoc = new TypedDocumentString(
  `
    fragment CartItem on StoreOffer {
  seller {
    identifier
  }
  quantity
  price
  listPrice
  itemOffered {
    ...CartProductItem
  }
}
    fragment CartProductItem on StoreProduct {
  sku
  name
  image {
    url
    alternateName
    keywords
  }
  brand {
    name
  }
  isVariantOf {
    productGroupID
    name
    skuVariants {
      activeVariations
      slugsMap
      availableVariations
    }
  }
  gtin
  additionalProperty {
    propertyID
    name
    value
    valueReference
  }
}`,
  { fragmentName: 'CartItem' }
) as unknown as TypedDocumentString<CartItemFragment, unknown>
export const SearchEvent_MetadataFragmentDoc = new TypedDocumentString(
  `
    fragment SearchEvent_metadata on SearchMetadata {
  isTermMisspelled
  logicalOperator
  fuzzy
}
    `,
  { fragmentName: 'SearchEvent_metadata' }
) as unknown as TypedDocumentString<SearchEvent_MetadataFragment, unknown>
export const ServerCollectionPageQueryDocument = {
  __meta__: {
    operationName: 'ServerCollectionPageQuery',
    operationHash: '4b33c5c07f440dc7489e55619dc2211a13786e72',
  },
} as unknown as TypedDocumentString<
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables
>
export const ServerProductQueryDocument = {
  __meta__: {
    operationName: 'ServerProductQuery',
    operationHash: '39dca07bdd286cb7d7fce3c548bdb91ef53964ac',
  },
} as unknown as TypedDocumentString<
  ServerProductQueryQuery,
  ServerProductQueryQueryVariables
>
export const ValidateCartMutationDocument = {
  __meta__: {
    operationName: 'ValidateCartMutation',
    operationHash: '700b201c2980a24df0c8f59cddd6d065e6a38421',
  },
} as unknown as TypedDocumentString<
  ValidateCartMutationMutation,
  ValidateCartMutationMutationVariables
>
export const SubscribeToNewsletterDocument = {
  __meta__: {
    operationName: 'SubscribeToNewsletter',
    operationHash: 'feb7005103a859e2bc8cf2360d568806fd88deba',
  },
} as unknown as TypedDocumentString<
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables
>
export const ClientManyProductsQueryDocument = {
  __meta__: {
    operationName: 'ClientManyProductsQuery',
    operationHash: 'b854e384d076dc482f0afe016b604d527f2562a3',
  },
} as unknown as TypedDocumentString<
  ClientManyProductsQueryQuery,
  ClientManyProductsQueryQueryVariables
>
export const ClientProductGalleryQueryDocument = {
  __meta__: {
    operationName: 'ClientProductGalleryQuery',
    operationHash: '054742a6e1a39f1e09237dcec956879d964f3f20',
  },
} as unknown as TypedDocumentString<
  ClientProductGalleryQueryQuery,
  ClientProductGalleryQueryQueryVariables
>
export const ClientProductQueryDocument = {
  __meta__: {
    operationName: 'ClientProductQuery',
    operationHash: '78fce47368ab9e53a42c33058ff7764f6f6ad0e8',
  },
} as unknown as TypedDocumentString<
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables
>
export const ClientSearchSuggestionsQueryDocument = {
  __meta__: {
    operationName: 'ClientSearchSuggestionsQuery',
    operationHash: 'd145a09bc100dd52d67e3b2624081da2cff66bee',
  },
} as unknown as TypedDocumentString<
  ClientSearchSuggestionsQueryQuery,
  ClientSearchSuggestionsQueryQueryVariables
>
export const ClientTopSearchSuggestionsQueryDocument = {
  __meta__: {
    operationName: 'ClientTopSearchSuggestionsQuery',
    operationHash: 'e2385b0f11726d0068f96548f57a8dd441c064e3',
  },
} as unknown as TypedDocumentString<
  ClientTopSearchSuggestionsQueryQuery,
  ClientTopSearchSuggestionsQueryQueryVariables
>
export const ValidateSessionDocument = {
  __meta__: {
    operationName: 'ValidateSession',
    operationHash: '5696202828f9275216a445e316ebf516f168c506',
  },
} as unknown as TypedDocumentString<
  ValidateSessionMutation,
  ValidateSessionMutationVariables
>
export const ClientShippingSimulationQueryDocument = {
  __meta__: {
    operationName: 'ClientShippingSimulationQuery',
    operationHash: 'd6667f1de2a26b94b9b55f4b25d7d823f82635a0',
  },
} as unknown as TypedDocumentString<
  ClientShippingSimulationQueryQuery,
  ClientShippingSimulationQueryQueryVariables
>
