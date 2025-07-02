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
  JSONObject: { input: any; output: any }
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

/** Advertisement information about a specific product in a campaign */
export type Advertisement = {
  /** Cost of the action, usually Cost Per Click. */
  actionCost: Scalars['Float']['output']
  /** Advertiser ID of the product. */
  adId: Scalars['String']['output']
  /** Advertiser Request ID. */
  adRequestId: Scalars['String']['output']
  /** Advertiser Response ID. */
  adResponseId: Scalars['String']['output']
  /** Campaign ID. */
  campaignId: Scalars['String']['output']
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

export type IStoreB2B = {
  customerId: Scalars['String']['input']
  firstName: InputMaybe<Scalars['String']['input']>
  isRepresentative: InputMaybe<Scalars['Boolean']['input']>
  lastName: InputMaybe<Scalars['String']['input']>
  unitId: InputMaybe<Scalars['String']['input']>
  unitName: InputMaybe<Scalars['String']['input']>
  userEmail: InputMaybe<Scalars['String']['input']>
  userName: InputMaybe<Scalars['String']['input']>
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
  /** Image input URL. */
  url: Scalars['String']['input']
}

export type IStoreMarketingData = {
  utmCampaign: InputMaybe<Scalars['String']['input']>
  utmMedium: InputMaybe<Scalars['String']['input']>
  utmSource: InputMaybe<Scalars['String']['input']>
  utmiCampaign: InputMaybe<Scalars['String']['input']>
  utmiPage: InputMaybe<Scalars['String']['input']>
  utmiPart: InputMaybe<Scalars['String']['input']>
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
  valueReference: Scalars['ObjectOrString']['input']
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
  /** Session input b2b. */
  b2b: InputMaybe<IStoreB2B>
  /** Session input channel. */
  channel: InputMaybe<Scalars['String']['input']>
  /** Session input city. */
  city: InputMaybe<Scalars['String']['input']>
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
  /** Marketing information input. */
  marketingData: InputMaybe<IStoreMarketingData>
  /** Session input person. */
  person: InputMaybe<IStorePerson>
  /** Session input postal code. */
  postalCode: InputMaybe<Scalars['String']['input']>
}

/** Input to the cancel order API. */
export type IUserOrderCancel = {
  /** Customer's email. */
  customerEmail: InputMaybe<Scalars['String']['input']>
  /** Person's name. */
  orderId: Scalars['String']['input']
  /** Reason. */
  reason: InputMaybe<Scalars['String']['input']>
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
  /** Cancels user order */
  cancelOrder: Maybe<UserOrderCancel>
  /** Subscribes a new person to the newsletter list. */
  subscribeToNewsletter: Maybe<PersonNewsletter>
  /** Checks for changes between the cart presented in the UI and the cart stored in the ecommerce platform. If changes are detected, it returns the cart stored on the platform. Otherwise, it returns `null`. */
  validateCart: Maybe<StoreCart>
  /** Updates a web session with the specified values. */
  validateSession: Maybe<StoreSession>
}

export type MutationCancelOrderArgs = {
  data: IUserOrderCancel
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

export type ProductCountResult = {
  /** Total product count. */
  total: Scalars['Int']['output']
}

export type Profile = {
  /** Collection of user's address */
  addresses: Maybe<Array<Maybe<ProfileAddress>>>
}

export type ProfileAddress = {
  /** ProfileAddress address name/id. */
  addressName: Maybe<Scalars['String']['output']>
  /** ProfileAddress address type. */
  addressType: Maybe<Scalars['String']['output']>
  /** ProfileAddress city. */
  city: Maybe<Scalars['String']['output']>
  /** ProfileAddress complement. */
  complement: Maybe<Scalars['String']['output']>
  /** ProfileAddress country. */
  country: Maybe<Scalars['String']['output']>
  /** ProfileAddress geo coordinate. */
  geoCoordinate: Maybe<Array<Maybe<Scalars['Float']['output']>>>
  /** ProfileAddress neighborhood. */
  neighborhood: Maybe<Scalars['String']['output']>
  /** ProfileAddress number. */
  number: Maybe<Scalars['String']['output']>
  /** ProfileAddress postal code. */
  postalCode: Maybe<Scalars['String']['output']>
  /** ProfileAddress receiver name. */
  receiverName: Maybe<Scalars['String']['output']>
  /** ProfileAddress reference. */
  reference: Maybe<Scalars['String']['output']>
  /** ProfileAddress state. */
  state: Maybe<Scalars['String']['output']>
  /** ProfileAddress street. */
  street: Maybe<Scalars['String']['output']>
}

export type Query = {
  /** Returns the account name of the current user or the B2B contract name if applicable. */
  accountName: Maybe<Scalars['String']['output']>
  /** Returns information about all collections. */
  allCollections: StoreCollectionConnection
  /** Returns information about all products. */
  allProducts: StoreProductConnection
  /** Returns the details of a collection based on the collection slug. */
  collection: StoreCollection
  /** Returns information about the list of Orders that the User can view. */
  listUserOrders: Maybe<UserOrderListMinimalResult>
  /** Returns the details of a product based on the specified locator. */
  product: StoreProduct
  /** Returns the total product count information based on a specific location accessible through the VTEX segment cookie. */
  productCount: Maybe<ProductCountResult>
  /** Returns information about the profile. */
  profile: Maybe<Profile>
  /** Returns if there's a redirect for a search. */
  redirect: Maybe<StoreRedirect>
  /** Returns the result of a product, facet, or suggestion search. */
  search: StoreSearchResult
  /** Returns a list of sellers available for a specific localization. */
  sellers: Maybe<SellersData>
  /** Returns information about shipping simulation. */
  shipping: Maybe<ShippingData>
  /** Returns information about the Details of an User Order. */
  userOrder: Maybe<UserOrderResult>
  /** Returns information about the user validation. */
  validateUser: Maybe<ValidateUserData>
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

export type QueryListUserOrdersArgs = {
  clientEmail: InputMaybe<Scalars['String']['input']>
  dateFinal: InputMaybe<Scalars['String']['input']>
  dateInitial: InputMaybe<Scalars['String']['input']>
  page: InputMaybe<Scalars['Int']['input']>
  perPage: InputMaybe<Scalars['Int']['input']>
  status: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  text: InputMaybe<Scalars['String']['input']>
}

export type QueryProductArgs = {
  locator: Array<IStoreSelectedFacet>
}

export type QueryProductCountArgs = {
  term: InputMaybe<Scalars['String']['input']>
}

export type QueryProfileArgs = {
  id: Scalars['String']['input']
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
  sponsoredCount: InputMaybe<Scalars['Int']['input']>
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

export type QueryUserOrderArgs = {
  orderId: Scalars['String']['input']
}

/** Search result. */
export type SearchMetadata = {
  /** Indicates how the search engine corrected the misspelled word by using fuzzy logic. */
  fuzzy: Maybe<Scalars['String']['output']>
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
  /** All possible variant combinations of the current product. It also includes the data for each variant. */
  allVariantProducts: Maybe<Array<StoreProduct>>
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
  /** Lowest price among all sellers with current taxes. */
  lowPriceWithTaxes: Scalars['Float']['output']
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

export type StoreB2B = {
  customerId: Scalars['String']['output']
  firstName: Maybe<Scalars['String']['output']>
  isRepresentative: Maybe<Scalars['Boolean']['output']>
  lastName: Maybe<Scalars['String']['output']>
  unitId: Maybe<Scalars['String']['output']>
  unitName: Maybe<Scalars['String']['output']>
  userEmail: Maybe<Scalars['String']['output']>
  userName: Maybe<Scalars['String']['output']>
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
  /** Order information, including `orderNumber`, `acceptedOffer` and `shouldSplitItem`. */
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

/** Marketing information. */
export type StoreMarketingData = {
  utmCampaign: Maybe<Scalars['String']['output']>
  utmMedium: Maybe<Scalars['String']['output']>
  utmSource: Maybe<Scalars['String']['output']>
  utmiCampaign: Maybe<Scalars['String']['output']>
  utmiPage: Maybe<Scalars['String']['output']>
  utmiPart: Maybe<Scalars['String']['output']>
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
  /** List price among with current taxes. */
  listPriceWithTaxes: Scalars['Float']['output']
  /** Also known as spot price. */
  price: Scalars['Float']['output']
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String']['output']
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil: Scalars['String']['output']
  /** Also known as spot price with taxes. */
  priceWithTaxes: Scalars['Float']['output']
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
  /** Indicates whether or not items with attachments should be split. */
  shouldSplitItem: Maybe<Scalars['Boolean']['output']>
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
  /** Advertisement information about the product. */
  advertisement: Maybe<Advertisement>
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
  /** Sku Unit Multiplier */
  unitMultiplier: Maybe<Scalars['Float']['output']>
}

/** Product information. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProductImageArgs = {
  context?: InputMaybe<Scalars['String']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
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
  valueReference: Scalars['ObjectOrString']['output']
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
  /** B2B Information. */
  b2b: Maybe<StoreB2B>
  /** Session channel. */
  channel: Maybe<Scalars['String']['output']>
  /** Session city. */
  city: Maybe<Scalars['String']['output']>
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
  /** Marketing information. */
  marketingData: Maybe<StoreMarketingData>
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

export type UserOrder = {
  affiliateId: Maybe<Scalars['String']['output']>
  allowCancellation: Maybe<Scalars['Boolean']['output']>
  allowEdition: Maybe<Scalars['Boolean']['output']>
  authorizedDate: Maybe<Scalars['String']['output']>
  callCenterOperatorData: Maybe<Scalars['String']['output']>
  canCancelOrder: Maybe<Scalars['Boolean']['output']>
  cancelReason: Maybe<Scalars['String']['output']>
  cancellationData: Maybe<UserOrderCancellationData>
  cancellationRequests: Maybe<Array<Maybe<UserOrderCancellationRequest>>>
  changesAttachment: Maybe<Scalars['String']['output']>
  checkedInPickupPointId: Maybe<Scalars['String']['output']>
  clientPreferencesData: Maybe<UserOrderClientPreferencesData>
  clientProfileData: Maybe<UserOrderClientProfileData>
  commercialConditionData: Maybe<Scalars['String']['output']>
  creationDate: Maybe<Scalars['String']['output']>
  customData: Maybe<UserOrderCustomData>
  customFields: Maybe<Array<Maybe<UserOrderCustomFieldsGrouped>>>
  deliveryOptionsData: Maybe<UserOrderDeliveryOptionsData>
  followUpEmail: Maybe<Scalars['String']['output']>
  giftRegistryData: Maybe<Scalars['String']['output']>
  hostname: Maybe<Scalars['String']['output']>
  invoiceData: Maybe<Scalars['String']['output']>
  invoicedDate: Maybe<Scalars['String']['output']>
  isCheckedIn: Maybe<Scalars['Boolean']['output']>
  isCompleted: Maybe<Scalars['Boolean']['output']>
  itemMetadata: Maybe<UserOrderItemMetadata>
  items: Maybe<Array<Maybe<UserOrderItems>>>
  lastChange: Maybe<Scalars['String']['output']>
  lastMessage: Maybe<Scalars['String']['output']>
  marketingData: Maybe<Scalars['String']['output']>
  marketplace: Maybe<UserOrderMarketplace>
  marketplaceItems: Maybe<Array<Maybe<UserOrderItems>>>
  marketplaceOrderId: Maybe<Scalars['String']['output']>
  marketplaceServicesEndpoint: Maybe<Scalars['String']['output']>
  merchantName: Maybe<Scalars['String']['output']>
  openTextField: Maybe<Scalars['String']['output']>
  orderFormId: Maybe<Scalars['String']['output']>
  orderGroup: Maybe<Scalars['String']['output']>
  orderId: Maybe<Scalars['String']['output']>
  origin: Maybe<Scalars['String']['output']>
  packageAttachment: Maybe<UserOrderPackageAttachment>
  paymentData: Maybe<UserOrderPaymentData>
  ratesAndBenefitsData: Maybe<UserOrderRatesAndBenefitsData>
  roundingError: Maybe<Scalars['Int']['output']>
  salesChannel: Maybe<Scalars['String']['output']>
  sellerOrderId: Maybe<Scalars['String']['output']>
  sellers: Maybe<Array<Maybe<UserOrderStoreSellers>>>
  sequence: Maybe<Scalars['String']['output']>
  shippingData: Maybe<UserOrderShippingData>
  status: Maybe<Scalars['String']['output']>
  statusDescription: Maybe<Scalars['String']['output']>
  storePreferencesData: Maybe<UserOrderStorePreferencesData>
  subscriptionData: Maybe<Scalars['String']['output']>
  taxData: Maybe<Scalars['String']['output']>
  totals: Maybe<Array<Maybe<UserOrderTotals>>>
  value: Maybe<Scalars['Float']['output']>
  workflowIsInError: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderAdditionalInfo = {
  brandId: Maybe<Scalars['String']['output']>
  brandName: Maybe<Scalars['String']['output']>
  categories: Maybe<Array<Maybe<UserOrderCategories>>>
  categoriesIds: Maybe<Scalars['String']['output']>
  commercialConditionId: Maybe<Scalars['String']['output']>
  dimension: Maybe<UserOrderDimension>
  offeringInfo: Maybe<Scalars['String']['output']>
  offeringType: Maybe<Scalars['String']['output']>
  offeringTypeId: Maybe<Scalars['String']['output']>
  productClusterId: Maybe<Scalars['String']['output']>
}

export type UserOrderAddress = {
  addressId: Maybe<Scalars['String']['output']>
  addressType: Maybe<Scalars['String']['output']>
  city: Maybe<Scalars['String']['output']>
  complement: Maybe<Scalars['String']['output']>
  country: Maybe<Scalars['String']['output']>
  entityId: Maybe<Scalars['String']['output']>
  geoCoordinates: Maybe<Array<Maybe<Scalars['Float']['output']>>>
  neighborhood: Maybe<Scalars['String']['output']>
  number: Maybe<Scalars['String']['output']>
  postalCode: Maybe<Scalars['String']['output']>
  receiverName: Maybe<Scalars['String']['output']>
  reference: Maybe<Scalars['String']['output']>
  state: Maybe<Scalars['String']['output']>
  street: Maybe<Scalars['String']['output']>
  versionId: Maybe<Scalars['String']['output']>
}

export type UserOrderAssemblyOptions = {
  Id: Maybe<Scalars['String']['output']>
  Name: Maybe<Scalars['String']['output']>
  Required: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderAttachmentOfferings = {
  name: Maybe<Scalars['String']['output']>
  required: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderAttachments = {
  content: Maybe<Scalars['JSONObject']['output']>
  name: Maybe<Scalars['String']['output']>
}

export type UserOrderCancel = {
  data: Maybe<Scalars['String']['output']>
}

export type UserOrderCancellationData = {
  CancellationDate: Maybe<Scalars['String']['output']>
  Reason: Maybe<Scalars['String']['output']>
  RequestedByPaymentNotification: Maybe<Scalars['Boolean']['output']>
  RequestedBySellerNotification: Maybe<Scalars['Boolean']['output']>
  RequestedBySystem: Maybe<Scalars['Boolean']['output']>
  RequestedByUser: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderCancellationRequest = {
  cancellationRequestDate: Maybe<Scalars['String']['output']>
  cancellationRequestDenyDate: Maybe<Scalars['String']['output']>
  deniedBySeller: Maybe<Scalars['Boolean']['output']>
  deniedBySellerReason: Maybe<Scalars['String']['output']>
  id: Maybe<Scalars['String']['output']>
  reason: Maybe<Scalars['String']['output']>
  requestedByUser: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderCategories = {
  id: Maybe<Scalars['Int']['output']>
  name: Maybe<Scalars['String']['output']>
}

export type UserOrderClientPreferencesData = {
  locale: Maybe<Scalars['String']['output']>
  optinNewsLetter: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderClientProfileData = {
  corporateDocument: Maybe<Scalars['String']['output']>
  corporateName: Maybe<Scalars['String']['output']>
  corporatePhone: Maybe<Scalars['String']['output']>
  customerClass: Maybe<Scalars['String']['output']>
  customerCode: Maybe<Scalars['String']['output']>
  document: Maybe<Scalars['String']['output']>
  documentType: Maybe<Scalars['String']['output']>
  email: Maybe<Scalars['String']['output']>
  firstName: Maybe<Scalars['String']['output']>
  id: Maybe<Scalars['String']['output']>
  isCorporate: Maybe<Scalars['Boolean']['output']>
  lastName: Maybe<Scalars['String']['output']>
  phone: Maybe<Scalars['String']['output']>
  stateInscription: Maybe<Scalars['String']['output']>
  tradeName: Maybe<Scalars['String']['output']>
  userProfileId: Maybe<Scalars['String']['output']>
  userProfileVersion: Maybe<Scalars['String']['output']>
}

export type UserOrderContactInformation = {
  document: Maybe<Scalars['String']['output']>
  documentType: Maybe<Scalars['String']['output']>
  email: Maybe<Scalars['String']['output']>
  firstName: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  lastName: Maybe<Scalars['String']['output']>
  phone: Maybe<Scalars['String']['output']>
}

export type UserOrderCourierStatus = {
  data: Maybe<Array<UserOrderTrackingInformation>>
  finished: Maybe<Scalars['Boolean']['output']>
  status: Maybe<Scalars['String']['output']>
}

export type UserOrderCurrencyFormatInfo = {
  CurrencyDecimalDigits: Maybe<Scalars['Int']['output']>
  CurrencyDecimalSeparator: Maybe<Scalars['String']['output']>
  CurrencyGroupSeparator: Maybe<Scalars['String']['output']>
  CurrencyGroupSize: Maybe<Scalars['Int']['output']>
  StartsWithCurrencySymbol: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderCustomApp = {
  fields: Maybe<UserOrderFields>
  id: Maybe<Scalars['String']['output']>
  major: Maybe<Scalars['Int']['output']>
}

export type UserOrderCustomData = {
  customApps: Maybe<Array<Maybe<UserOrderCustomApp>>>
  customFields: Maybe<Array<Maybe<UserOrderCustomField>>>
}

export type UserOrderCustomField = {
  fields: Array<UserOrderCustomFieldField>
  linkedEntity: UserOrderCustomFieldLinkedEntity
}

export type UserOrderCustomFieldField = {
  name: Scalars['String']['output']
  refId: Maybe<Scalars['String']['output']>
  value: Scalars['String']['output']
}

export type UserOrderCustomFieldLinkedEntity = {
  id: Maybe<Scalars['String']['output']>
  type: Scalars['String']['output']
}

export type UserOrderCustomFieldsGrouped = {
  fields: Maybe<Array<Maybe<UserOrderCustomFieldField>>>
  id: Maybe<Scalars['String']['output']>
  type: Scalars['String']['output']
}

export type UserOrderDeliveryChannels = {
  id: Maybe<Scalars['String']['output']>
  stockBalance: Maybe<Scalars['Int']['output']>
}

export type UserOrderDeliveryIds = {
  accountCarrierName: Maybe<Scalars['String']['output']>
  courierId: Maybe<Scalars['String']['output']>
  courierName: Maybe<Scalars['String']['output']>
  dockId: Maybe<Scalars['String']['output']>
  kitItemDetails: Maybe<Array<Maybe<Scalars['String']['output']>>>
  quantity: Maybe<Scalars['Int']['output']>
  warehouseId: Maybe<Scalars['String']['output']>
}

export type UserOrderDeliveryOption = {
  address: Maybe<UserOrderAddress>
  deliveryChannel: Maybe<Scalars['String']['output']>
  deliveryCompany: Maybe<Scalars['String']['output']>
  deliveryWindow: Maybe<UserOrderDeliveryWindow>
  friendlyDeliveryOptionName: Maybe<Scalars['String']['output']>
  friendlyShippingEstimate: Maybe<Scalars['String']['output']>
  items: Maybe<Array<Maybe<UserOrderDeliveryOptionsItems>>>
  pickupStoreInfo: Maybe<UserOrderPickupStoreInfo>
  quantityOfDifferentItems: Maybe<Scalars['Int']['output']>
  selectedSla: Maybe<Scalars['String']['output']>
  seller: Maybe<Scalars['String']['output']>
  shippingEstimate: Maybe<Scalars['String']['output']>
  shippingEstimateDate: Maybe<Scalars['String']['output']>
  total: Maybe<Scalars['Int']['output']>
}

export type UserOrderDeliveryOptionsContact = {
  email: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
  phone: Maybe<Scalars['String']['output']>
}

export type UserOrderDeliveryOptionsData = {
  contact: Maybe<UserOrderDeliveryOptionsContact>
  deliveryOptions: Maybe<Array<Maybe<UserOrderDeliveryOption>>>
}

export type UserOrderDeliveryOptionsItems = {
  id: Maybe<Scalars['String']['output']>
  imageUrl: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
  price: Maybe<Scalars['Float']['output']>
  quantity: Maybe<Scalars['Int']['output']>
  tax: Maybe<Scalars['Float']['output']>
  total: Maybe<Scalars['Float']['output']>
}

export type UserOrderDeliveryWindow = {
  endDateUtc: Maybe<Scalars['String']['output']>
  price: Maybe<Scalars['Float']['output']>
  startDateUtc: Maybe<Scalars['String']['output']>
}

export type UserOrderDimension = {
  cubicweight: Maybe<Scalars['Float']['output']>
  height: Maybe<Scalars['Int']['output']>
  length: Maybe<Scalars['Int']['output']>
  weight: Maybe<Scalars['Int']['output']>
  width: Maybe<Scalars['Int']['output']>
}

export type UserOrderFields = {
  cartEtag: Maybe<Scalars['String']['output']>
}

export type UserOrderFromList = {
  ShippingEstimatedDate: Maybe<Scalars['String']['output']>
  ShippingEstimatedDateMax: Maybe<Scalars['String']['output']>
  ShippingEstimatedDateMin: Maybe<Scalars['String']['output']>
  affiliateId: Maybe<Scalars['String']['output']>
  authorizedDate: Maybe<Scalars['String']['output']>
  callCenterOperatorName: Maybe<Scalars['String']['output']>
  clientName: Maybe<Scalars['String']['output']>
  creationDate: Maybe<Scalars['String']['output']>
  currencyCode: Maybe<Scalars['String']['output']>
  customFields: Maybe<Array<Maybe<UserOrderFromListCustomFields>>>
  deliveryDates: Maybe<Array<Maybe<Scalars['String']['output']>>>
  giftCardProviders: Maybe<Array<Maybe<Scalars['String']['output']>>>
  hostname: Maybe<Scalars['String']['output']>
  invoiceInput: Maybe<Array<Maybe<Scalars['String']['output']>>>
  invoiceOutput: Maybe<Array<Maybe<Scalars['String']['output']>>>
  isAllDelivered: Maybe<Scalars['Boolean']['output']>
  isAnyDelivered: Maybe<Scalars['Boolean']['output']>
  items: Maybe<Array<Maybe<UserOrderItemsSummarized>>>
  lastChange: Maybe<Scalars['String']['output']>
  lastMessageUnread: Maybe<Scalars['String']['output']>
  listId: Maybe<Scalars['String']['output']>
  listType: Maybe<Scalars['String']['output']>
  marketPlaceOrderId: Maybe<Scalars['String']['output']>
  orderFormId: Maybe<Scalars['String']['output']>
  orderId: Maybe<Scalars['String']['output']>
  orderIsComplete: Maybe<Scalars['Boolean']['output']>
  origin: Maybe<Scalars['String']['output']>
  paymentApprovedDate: Maybe<Scalars['String']['output']>
  paymentNames: Maybe<Scalars['String']['output']>
  readyForHandlingDate: Maybe<Scalars['String']['output']>
  salesChannel: Maybe<Scalars['String']['output']>
  sequence: Maybe<Scalars['String']['output']>
  status: Maybe<Scalars['String']['output']>
  statusDescription: Maybe<Scalars['String']['output']>
  totalItems: Maybe<Scalars['Int']['output']>
  totalValue: Maybe<Scalars['Float']['output']>
  workflowInErrorState: Maybe<Scalars['Boolean']['output']>
  workflowInRetry: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderFromListCustomFields = {
  type: Maybe<Scalars['String']['output']>
  value: Maybe<Array<Maybe<Scalars['String']['output']>>>
}

export type UserOrderFromListMinimal = {
  ShippingEstimatedDate: Maybe<Scalars['String']['output']>
  clientName: Maybe<Scalars['String']['output']>
  creationDate: Maybe<Scalars['String']['output']>
  currencyCode: Maybe<Scalars['String']['output']>
  customFields: Maybe<Array<Maybe<UserOrderFromListCustomFields>>>
  items: Maybe<Array<Maybe<UserOrderItemsSummarized>>>
  orderId: Maybe<Scalars['String']['output']>
  status: Maybe<Scalars['String']['output']>
  statusDescription: Maybe<Scalars['String']['output']>
  totalValue: Maybe<Scalars['Float']['output']>
}

export type UserOrderInvoiceType = 'Input' | 'Output'

export type UserOrderItemAttachment = {
  name: Maybe<Scalars['String']['output']>
}

export type UserOrderItemMetadata = {
  Items: Maybe<Array<Maybe<UserOrderItemMetadataItem>>>
}

export type UserOrderItemMetadataItem = {
  AssemblyOptions: Maybe<Array<Maybe<UserOrderAssemblyOptions>>>
  DetailUrl: Maybe<Scalars['String']['output']>
  Ean: Maybe<Scalars['String']['output']>
  Id: Maybe<Scalars['String']['output']>
  ImageUrl: Maybe<Scalars['String']['output']>
  Name: Maybe<Scalars['String']['output']>
  ProductId: Maybe<Scalars['String']['output']>
  RefId: Maybe<Scalars['String']['output']>
  Seller: Maybe<Scalars['String']['output']>
  SkuName: Maybe<Scalars['String']['output']>
}

export type UserOrderItems = {
  additionalInfo: Maybe<UserOrderAdditionalInfo>
  assemblies: Maybe<Array<Maybe<Scalars['String']['output']>>>
  attachmentOfferings: Maybe<Array<Maybe<UserOrderAttachmentOfferings>>>
  attachments: Maybe<Array<Maybe<UserOrderAttachments>>>
  bundleItems: Maybe<Array<Maybe<UserOrderItems>>>
  callCenterOperator: Maybe<Scalars['String']['output']>
  commission: Maybe<Scalars['Float']['output']>
  components: Maybe<Array<Maybe<UserOrderItems>>>
  costPrice: Maybe<Scalars['Float']['output']>
  detailUrl: Maybe<Scalars['String']['output']>
  ean: Maybe<Scalars['String']['output']>
  freightCommission: Maybe<Scalars['Float']['output']>
  id: Maybe<Scalars['String']['output']>
  imageUrl: Maybe<Scalars['String']['output']>
  isGift: Maybe<Scalars['Boolean']['output']>
  itemAttachment: Maybe<UserOrderItemAttachment>
  listPrice: Maybe<Scalars['Float']['output']>
  lockId: Maybe<Scalars['String']['output']>
  manualPrice: Maybe<Scalars['String']['output']>
  manualPriceAppliedBy: Maybe<Scalars['String']['output']>
  measurementUnit: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
  offerings: Maybe<Array<Maybe<UserOrderOfferings>>>
  params: Maybe<Array<Maybe<Scalars['String']['output']>>>
  parentAssemblyBinding: Maybe<Scalars['String']['output']>
  parentItemIndex: Maybe<Scalars['String']['output']>
  preSaleDate: Maybe<Scalars['String']['output']>
  price: Maybe<Scalars['Float']['output']>
  priceDefinition: Maybe<UserOrderPriceDefinition>
  priceTags: Maybe<Array<Maybe<UserOrderPriceTag>>>
  priceValidUntil: Maybe<Scalars['String']['output']>
  productId: Maybe<Scalars['String']['output']>
  quantity: Maybe<Scalars['Int']['output']>
  refId: Maybe<Scalars['String']['output']>
  rewardValue: Maybe<Scalars['Float']['output']>
  seller: Maybe<Scalars['String']['output']>
  sellerSku: Maybe<Scalars['String']['output']>
  sellingPrice: Maybe<Scalars['Float']['output']>
  serialNumbers: Maybe<Scalars['String']['output']>
  shippingPrice: Maybe<Scalars['String']['output']>
  tax: Maybe<Scalars['Float']['output']>
  taxCode: Maybe<Scalars['String']['output']>
  uniqueId: Maybe<Scalars['String']['output']>
  unitMultiplier: Maybe<Scalars['Float']['output']>
}

export type UserOrderItemsSummarized = {
  description: Maybe<Scalars['String']['output']>
  ean: Maybe<Scalars['String']['output']>
  id: Maybe<Scalars['String']['output']>
  price: Maybe<Scalars['Float']['output']>
  productId: Maybe<Scalars['String']['output']>
  quantity: Maybe<Scalars['Int']['output']>
  refId: Maybe<Scalars['String']['output']>
  seller: Maybe<Scalars['String']['output']>
  sellingPrice: Maybe<Scalars['Float']['output']>
}

export type UserOrderListMinimalResult = {
  list: Maybe<Array<Maybe<UserOrderFromListMinimal>>>
  paging: Maybe<UserOrderListPaging>
}

export type UserOrderListPaging = {
  currentPage: Maybe<Scalars['Int']['output']>
  pages: Maybe<Scalars['Int']['output']>
  perPage: Maybe<Scalars['Int']['output']>
  total: Maybe<Scalars['Int']['output']>
}

export type UserOrderListResult = {
  facets: Maybe<Array<Maybe<Scalars['String']['output']>>>
  list: Maybe<Array<UserOrderFromList>>
  paging: Maybe<UserOrderListPaging>
  reportRecordsLimit: Maybe<Scalars['Int']['output']>
  stats: Maybe<UserOrderListStats>
}

export type UserOrderListStats = {
  stats: Maybe<UserOrderListStatsData>
}

export type UserOrderListStatsData = {
  totalItems: Maybe<UserOrderListStatsValue>
  totalValue: Maybe<UserOrderListStatsValue>
}

export type UserOrderListStatsValue = {
  Count: Maybe<Scalars['Int']['output']>
  Facets: Maybe<Scalars['JSONObject']['output']>
  Max: Maybe<Scalars['Float']['output']>
  Mean: Maybe<Scalars['Float']['output']>
  Min: Maybe<Scalars['Float']['output']>
  Missing: Maybe<Scalars['Int']['output']>
  StdDev: Maybe<Scalars['Float']['output']>
  Sum: Maybe<Scalars['Float']['output']>
  SumOfSquares: Maybe<Scalars['Float']['output']>
}

export type UserOrderLogisticsInfo = {
  addressId: Maybe<Scalars['String']['output']>
  deliveryChannel: Maybe<Scalars['String']['output']>
  deliveryChannels: Maybe<Array<Maybe<UserOrderDeliveryChannels>>>
  deliveryCompany: Maybe<Scalars['String']['output']>
  deliveryIds: Maybe<Array<Maybe<UserOrderDeliveryIds>>>
  deliveryWindow: Maybe<UserOrderDeliveryWindow>
  entityId: Maybe<Scalars['String']['output']>
  itemId: Maybe<Scalars['String']['output']>
  itemIndex: Maybe<Scalars['Int']['output']>
  listPrice: Maybe<Scalars['Float']['output']>
  lockTTL: Maybe<Scalars['String']['output']>
  pickupPointId: Maybe<Scalars['String']['output']>
  pickupStoreInfo: Maybe<UserOrderPickupStoreInfo>
  polygonName: Maybe<Scalars['String']['output']>
  price: Maybe<Scalars['Float']['output']>
  selectedDeliveryChannel: Maybe<Scalars['String']['output']>
  selectedSla: Maybe<Scalars['String']['output']>
  sellingPrice: Maybe<Scalars['Float']['output']>
  shippingEstimate: Maybe<Scalars['String']['output']>
  shippingEstimateDate: Maybe<Scalars['String']['output']>
  shipsTo: Maybe<Array<Maybe<Scalars['String']['output']>>>
  slas: Maybe<Array<Maybe<UserOrderSlas>>>
  transitTime: Maybe<Scalars['String']['output']>
  versionId: Maybe<Scalars['String']['output']>
}

export type UserOrderMarketplace = {
  baseURL: Maybe<Scalars['String']['output']>
  isCertified: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
}

export type UserOrderOfferings = {
  id: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
  price: Maybe<Scalars['Float']['output']>
  type: Maybe<Scalars['String']['output']>
}

export type UserOrderPackage = {
  courier: Maybe<Scalars['String']['output']>
  courierStatus: Maybe<UserOrderCourierStatus>
  extraValue: Maybe<Scalars['Float']['output']>
  invoiceKey: Maybe<Scalars['String']['output']>
  invoiceNumber: Scalars['String']['output']
  invoiceUrl: Maybe<Scalars['String']['output']>
  invoiceValue: Scalars['Float']['output']
  issuanceDate: Maybe<Scalars['String']['output']>
  items: Maybe<Array<UserOrderPackageItem>>
  restitutions: Maybe<UserOrderRestitutions>
  trackingNumber: Maybe<Scalars['String']['output']>
  trackingUrl: Maybe<Scalars['String']['output']>
  type: Maybe<UserOrderInvoiceType>
}

export type UserOrderPackageAttachment = {
  packages: Maybe<Array<Maybe<UserOrderPackage>>>
}

export type UserOrderPackageItem = {
  description: Maybe<Scalars['String']['output']>
  itemIndex: Maybe<Scalars['Int']['output']>
  price: Maybe<Scalars['Int']['output']>
  quantity: Maybe<Scalars['Int']['output']>
}

export type UserOrderPaymentConnectorResponses = {
  Message: Maybe<Scalars['String']['output']>
  ReturnCode: Maybe<Scalars['String']['output']>
  Tid: Maybe<Scalars['String']['output']>
  authId: Maybe<Scalars['String']['output']>
}

export type UserOrderPaymentData = {
  giftCards: Maybe<Array<Maybe<Scalars['String']['output']>>>
  transactions: Maybe<Array<Maybe<UserOrderTransactions>>>
}

export type UserOrderPayments = {
  accountId: Maybe<Scalars['String']['output']>
  bankIssuedInvoiceBarCodeNumber: Maybe<Scalars['String']['output']>
  bankIssuedInvoiceBarCodeType: Maybe<Scalars['String']['output']>
  bankIssuedInvoiceIdentificationNumber: Maybe<Scalars['String']['output']>
  bankIssuedInvoiceIdentificationNumberFormatted: Maybe<
    Scalars['String']['output']
  >
  billingAddress: Maybe<Scalars['String']['output']>
  cardHolder: Maybe<Scalars['String']['output']>
  cardNumber: Maybe<Scalars['String']['output']>
  connectorResponses: Maybe<UserOrderPaymentConnectorResponses>
  cvv2: Maybe<Scalars['String']['output']>
  dueDate: Maybe<Scalars['String']['output']>
  expireMonth: Maybe<Scalars['String']['output']>
  expireYear: Maybe<Scalars['String']['output']>
  firstDigits: Maybe<Scalars['String']['output']>
  giftCardAsDiscount: Maybe<Scalars['String']['output']>
  giftCardCaption: Maybe<Scalars['String']['output']>
  giftCardId: Maybe<Scalars['String']['output']>
  giftCardName: Maybe<Scalars['String']['output']>
  giftCardProvider: Maybe<Scalars['String']['output']>
  group: Maybe<Scalars['String']['output']>
  id: Maybe<Scalars['String']['output']>
  installments: Maybe<Scalars['Int']['output']>
  koinUrl: Maybe<Scalars['String']['output']>
  lastDigits: Maybe<Scalars['String']['output']>
  parentAccountId: Maybe<Scalars['String']['output']>
  paymentOrigin: Maybe<Scalars['String']['output']>
  paymentSystem: Maybe<Scalars['String']['output']>
  paymentSystemName: Maybe<Scalars['String']['output']>
  redemptionCode: Maybe<Scalars['String']['output']>
  referenceValue: Maybe<Scalars['Int']['output']>
  tid: Maybe<Scalars['String']['output']>
  url: Maybe<Scalars['String']['output']>
  value: Maybe<Scalars['Int']['output']>
}

export type UserOrderPickupStoreInfo = {
  additionalInfo: Maybe<Scalars['String']['output']>
  address: Maybe<UserOrderAddress>
  dockId: Maybe<Scalars['String']['output']>
  friendlyName: Maybe<Scalars['String']['output']>
  isPickupStore: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderPriceDefinition = {
  calculatedSellingPrice: Maybe<Scalars['Float']['output']>
  reason: Maybe<Scalars['String']['output']>
  sellingPrices: Maybe<Array<Maybe<UserOrderSellingPrices>>>
  total: Maybe<Scalars['Float']['output']>
}

export type UserOrderPriceTag = {
  identifier: Maybe<Scalars['String']['output']>
  isPercentual: Maybe<Scalars['Boolean']['output']>
  jurisCode: Maybe<Scalars['String']['output']>
  jurisName: Maybe<Scalars['String']['output']>
  jurisType: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  owner: Maybe<Scalars['String']['output']>
  rate: Maybe<Scalars['Float']['output']>
  rawValue: Scalars['Float']['output']
  value: Maybe<Scalars['Float']['output']>
}

export type UserOrderRateAndBenefitsIdentifier = {
  additionalInfo: Maybe<Scalars['String']['output']>
  description: Maybe<Scalars['String']['output']>
  featured: Maybe<Scalars['Boolean']['output']>
  id: Maybe<Scalars['ID']['output']>
  name: Maybe<Scalars['String']['output']>
}

export type UserOrderRatesAndBenefitsData = {
  id: Maybe<Scalars['String']['output']>
  rateAndBenefitsIdentifiers: Maybe<
    Array<Maybe<UserOrderRateAndBenefitsIdentifier>>
  >
}

export type UserOrderRestitutionItem = {
  compensationValue: Maybe<Scalars['Float']['output']>
  description: Maybe<Scalars['String']['output']>
  id: Maybe<Scalars['ID']['output']>
  isCompensation: Maybe<Scalars['Boolean']['output']>
  itemIndex: Maybe<Scalars['Int']['output']>
  price: Maybe<Scalars['Float']['output']>
  quantity: Maybe<Scalars['Int']['output']>
  unitMultiplier: Maybe<Scalars['Float']['output']>
  useFreight: Maybe<Scalars['Boolean']['output']>
}

export type UserOrderRestitutionOption = {
  items: Maybe<Array<UserOrderRestitutionItem>>
  value: Maybe<Scalars['Float']['output']>
}

export type UserOrderRestitutions = {
  GiftCard: Maybe<UserOrderRestitutionOption>
  Refund: Maybe<UserOrderRestitutionOption>
}

export type UserOrderResult = {
  allowCancellation: Maybe<Scalars['Boolean']['output']>
  canCancelOrder: Maybe<Scalars['Boolean']['output']>
  clientProfileData: Maybe<UserOrderClientProfileData>
  customData: Maybe<UserOrderCustomData>
  customFields: Maybe<Array<Maybe<UserOrderCustomFieldsGrouped>>>
  deliveryOptionsData: Maybe<UserOrderDeliveryOptionsData>
  items: Maybe<Array<Maybe<UserOrderItems>>>
  orderId: Maybe<Scalars['String']['output']>
  paymentData: Maybe<UserOrderPaymentData>
  shippingData: Maybe<UserOrderShippingData>
  status: Maybe<Scalars['String']['output']>
  statusDescription: Maybe<Scalars['String']['output']>
  storePreferencesData: Maybe<UserOrderStorePreferencesData>
  totals: Maybe<Array<Maybe<UserOrderTotals>>>
}

export type UserOrderSellingPrices = {
  quantity: Maybe<Scalars['Int']['output']>
  value: Maybe<Scalars['Float']['output']>
}

export type UserOrderShippingData = {
  address: Maybe<UserOrderAddress>
  availableAddresses: Maybe<Array<Maybe<UserOrderAddress>>>
  contactInformation: Maybe<Array<Maybe<UserOrderContactInformation>>>
  id: Maybe<Scalars['String']['output']>
  logisticsInfo: Maybe<Array<Maybe<UserOrderLogisticsInfo>>>
  selectedAddresses: Maybe<Array<Maybe<UserOrderAddress>>>
  trackingHints: Maybe<Scalars['String']['output']>
}

export type UserOrderSlas = {
  availableDeliveryWindows: Maybe<Array<Maybe<UserOrderDeliveryWindow>>>
  deliveryChannel: Maybe<Scalars['String']['output']>
  deliveryIds: Maybe<Array<Maybe<UserOrderDeliveryIds>>>
  deliveryWindow: Maybe<UserOrderDeliveryWindow>
  id: Maybe<Scalars['String']['output']>
  listPrice: Maybe<Scalars['Float']['output']>
  lockTTL: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
  pickupDistance: Maybe<Scalars['Int']['output']>
  pickupPointId: Maybe<Scalars['String']['output']>
  pickupStoreInfo: Maybe<UserOrderPickupStoreInfo>
  polygonName: Maybe<Scalars['String']['output']>
  price: Maybe<Scalars['Float']['output']>
  shippingEstimate: Maybe<Scalars['String']['output']>
  shippingEstimateDate: Maybe<Scalars['String']['output']>
  transitTime: Maybe<Scalars['String']['output']>
}

export type UserOrderStorePreferencesData = {
  countryCode: Maybe<Scalars['String']['output']>
  currencyCode: Maybe<Scalars['String']['output']>
  currencyFormatInfo: Maybe<UserOrderCurrencyFormatInfo>
  currencyLocale: Maybe<Scalars['Int']['output']>
  currencySymbol: Maybe<Scalars['String']['output']>
  timeZone: Maybe<Scalars['String']['output']>
}

export type UserOrderStoreSellers = {
  fulfillmentEndpoint: Maybe<Scalars['String']['output']>
  id: Maybe<Scalars['String']['output']>
  logo: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
}

export type UserOrderTotals = {
  id: Maybe<Scalars['String']['output']>
  name: Maybe<Scalars['String']['output']>
  value: Maybe<Scalars['Float']['output']>
}

export type UserOrderTrackingInformation = {
  city: Maybe<Scalars['String']['output']>
  description: Maybe<Scalars['String']['output']>
  lastChange: Maybe<Scalars['String']['output']>
  state: Maybe<Scalars['String']['output']>
}

export type UserOrderTransactions = {
  isActive: Maybe<Scalars['Boolean']['output']>
  merchantName: Maybe<Scalars['String']['output']>
  payments: Maybe<Array<Maybe<UserOrderPayments>>>
  transactionId: Maybe<Scalars['String']['output']>
}

export type ValidateUserData = {
  /** Indicates if the user is valid. */
  isValid: Scalars['Boolean']['output']
}

export type ProductSummary_ProductFragment = {
  slug: string
  sku: string
  name: string
  gtin: string
  hasSpecifications: boolean | null
  unitMultiplier: number | null
  id: string
  brand: { name: string; brandName: string }
  isVariantOf: {
    productGroupID: string
    name: string
    skuVariants: {
      allVariantsByName: any | null
      activeVariations: any | null
      slugsMap: any | null
      availableVariations: any | null
      allVariantProducts: Array<{ name: string; productID: string }> | null
    } | null
  }
  image: Array<{ url: string; alternateName: string }>
  offers: {
    lowPrice: number
    lowPriceWithTaxes: number
    offers: Array<{
      availability: string
      price: number
      listPrice: number
      listPriceWithTaxes: number
      priceWithTaxes: number
      quantity: number
      seller: { identifier: string }
    }>
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: any
    valueReference: any
  }>
  advertisement: { adId: string; adResponseId: string } | null
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
  unitMultiplier: number | null
  id: string
  isVariantOf: {
    productGroupID: string
    name: string
    skuVariants: {
      activeVariations: any | null
      slugsMap: any | null
      availableVariations: any | null
      allVariantProducts: Array<{ name: string; productID: string }> | null
    } | null
  }
  image: Array<{ url: string; alternateName: string }>
  brand: { name: string }
  offers: {
    lowPrice: number
    lowPriceWithTaxes: number
    offers: Array<{
      availability: string
      price: number
      priceWithTaxes: number
      listPrice: number
      listPriceWithTaxes: number
      seller: { identifier: string }
    }>
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: any
    valueReference: any
  }>
}

export type ProductComparisonFragment_ProductFragment = {
  sku: string
  slug: string
  name: string
  gtin: string
  description: string
  unitMultiplier: number | null
  hasSpecifications: boolean | null
  id: string
  isVariantOf: {
    productGroupID: string
    name: string
    skuVariants: {
      activeVariations: any | null
      slugsMap: any | null
      availableVariations: any | null
      allVariantProducts: Array<{ name: string; productID: string }> | null
    } | null
  }
  image: Array<{ url: string; alternateName: string }>
  brand: { name: string }
  offers: {
    lowPrice: number
    lowPriceWithTaxes: number
    offers: Array<{
      availability: string
      price: number
      priceWithTaxes: number
      listPrice: number
      quantity: number
      listPriceWithTaxes: number
      seller: { identifier: string }
    }>
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: any
    valueReference: any
  }>
}

export type ProductSkuMatrixSidebarFragment_ProductFragment = {
  id: string
  isVariantOf: {
    name: string
    productGroupID: string
    skuVariants: {
      activeVariations: any | null
      slugsMap: any | null
      availableVariations: any | null
      allVariantProducts: Array<{
        sku: string
        name: string
        image: Array<{ url: string; alternateName: string }>
        offers: {
          highPrice: number
          lowPrice: number
          lowPriceWithTaxes: number
          offerCount: number
          priceCurrency: string
          offers: Array<{
            listPrice: number
            listPriceWithTaxes: number
            sellingPrice: number
            priceCurrency: string
            price: number
            priceWithTaxes: number
            priceValidUntil: string
            itemCondition: string
            availability: string
            quantity: number
          }>
        }
        additionalProperty: Array<{
          propertyID: string
          value: any
          name: string
          valueReference: any
        }>
      }> | null
    } | null
  }
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

export type ServerAccountPageQueryQueryVariables = Exact<{
  [key: string]: never
}>

export type ServerAccountPageQueryQuery = { accountName: string | null }

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
    unitMultiplier: number | null
    id: string
    seo: { title: string; description: string; canonical: string }
    brand: { name: string }
    breadcrumbList: {
      itemListElement: Array<{ item: string; name: string; position: number }>
    }
    image: Array<{ url: string; alternateName: string }>
    offers: {
      lowPrice: number
      highPrice: number
      lowPriceWithTaxes: number
      priceCurrency: string
      offers: Array<{
        availability: string
        price: number
        priceValidUntil: string
        priceCurrency: string
        itemCondition: string
        priceWithTaxes: number
        listPrice: number
        listPriceWithTaxes: number
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
        allVariantProducts: Array<{ name: string; productID: string }> | null
      } | null
    }
    additionalProperty: Array<{
      propertyID: string
      name: string
      value: any
      valueReference: any
    }>
  }
}

export type UserOrderItemsFragmentFragment = {
  id: string | null
  name: string | null
  quantity: number | null
  sellingPrice: number | null
  unitMultiplier: number | null
  measurementUnit: string | null
  imageUrl: string | null
  detailUrl: string | null
  refId: string | null
  rewardValue: number | null
}

export type ServerOrderDetailsQueryQueryVariables = Exact<{
  orderId: Scalars['String']['input']
}>

export type ServerOrderDetailsQueryQuery = {
  accountName: string | null
  userOrder: {
    orderId: string | null
    status: string | null
    canCancelOrder: boolean | null
    statusDescription: string | null
    allowCancellation: boolean | null
    storePreferencesData: { currencyCode: string | null } | null
    clientProfileData: {
      firstName: string | null
      lastName: string | null
      email: string | null
      phone: string | null
      corporateName: string | null
      isCorporate: boolean | null
    } | null
    customFields: Array<{
      type: string
      id: string | null
      fields: Array<{
        name: string
        value: string
        refId: string | null
      } | null> | null
    } | null> | null
    deliveryOptionsData: {
      deliveryOptions: Array<{
        selectedSla: string | null
        deliveryChannel: string | null
        deliveryCompany: string | null
        shippingEstimate: string | null
        shippingEstimateDate: string | null
        friendlyShippingEstimate: string | null
        friendlyDeliveryOptionName: string | null
        seller: string | null
        quantityOfDifferentItems: number | null
        total: number | null
        deliveryWindow: {
          startDateUtc: string | null
          endDateUtc: string | null
          price: number | null
        } | null
        address: {
          addressType: string | null
          receiverName: string | null
          addressId: string | null
          versionId: string | null
          entityId: string | null
          postalCode: string | null
          city: string | null
          state: string | null
          country: string | null
          street: string | null
          number: string | null
          neighborhood: string | null
          complement: string | null
          reference: string | null
          geoCoordinates: Array<number | null> | null
        } | null
        pickupStoreInfo: {
          additionalInfo: string | null
          dockId: string | null
          friendlyName: string | null
          isPickupStore: boolean | null
          address: {
            addressType: string | null
            receiverName: string | null
            addressId: string | null
            versionId: string | null
            entityId: string | null
            postalCode: string | null
            city: string | null
            state: string | null
            country: string | null
            street: string | null
            number: string | null
            neighborhood: string | null
            complement: string | null
            reference: string | null
            geoCoordinates: Array<number | null> | null
          } | null
        } | null
        items: Array<{
          id: string | null
          name: string | null
          quantity: number | null
          price: number | null
          imageUrl: string | null
          tax: number | null
          total: number | null
        } | null> | null
      } | null> | null
      contact: {
        email: string | null
        phone: string | null
        name: string | null
      } | null
    } | null
    paymentData: {
      transactions: Array<{
        isActive: boolean | null
        payments: Array<{
          id: string | null
          paymentSystemName: string | null
          value: number | null
          installments: number | null
          referenceValue: number | null
          lastDigits: string | null
          url: string | null
          group: string | null
          tid: string | null
          bankIssuedInvoiceIdentificationNumber: string | null
          redemptionCode: string | null
          paymentOrigin: string | null
          connectorResponses: { authId: string | null } | null
        } | null> | null
      } | null> | null
    } | null
    totals: Array<{
      id: string | null
      name: string | null
      value: number | null
    } | null> | null
  } | null
}

export type ServerListOrdersQueryQueryVariables = Exact<{
  page: InputMaybe<Scalars['Int']['input']>
  perPage: InputMaybe<Scalars['Int']['input']>
  status: InputMaybe<
    | Array<InputMaybe<Scalars['String']['input']>>
    | InputMaybe<Scalars['String']['input']>
  >
  dateInitial: InputMaybe<Scalars['String']['input']>
  dateFinal: InputMaybe<Scalars['String']['input']>
  text: InputMaybe<Scalars['String']['input']>
  clientEmail: InputMaybe<Scalars['String']['input']>
}>

export type ServerListOrdersQueryQuery = {
  accountName: string | null
  listUserOrders: {
    list: Array<{
      orderId: string | null
      creationDate: string | null
      clientName: string | null
      totalValue: number | null
      status: string | null
      statusDescription: string | null
      ShippingEstimatedDate: string | null
      currencyCode: string | null
      items: Array<{
        seller: string | null
        quantity: number | null
        description: string | null
        ean: string | null
        refId: string | null
        id: string | null
        productId: string | null
        sellingPrice: number | null
        price: number | null
      } | null> | null
      customFields: Array<{
        type: string | null
        value: Array<string | null> | null
      } | null> | null
    } | null> | null
    paging: {
      total: number | null
      pages: number | null
      currentPage: number | null
      perPage: number | null
    } | null
  } | null
}

export type ServerProfileQueryQueryVariables = Exact<{ [key: string]: never }>

export type ServerProfileQueryQuery = { accountName: string | null }

export type ServerSecurityQueryQueryVariables = Exact<{ [key: string]: never }>

export type ServerSecurityQueryQuery = { accountName: string | null }

export type ServerUserDetailsQueryQueryVariables = Exact<{
  [key: string]: never
}>

export type ServerUserDetailsQueryQuery = { accountName: string | null }

export type CancelOrderMutationMutationVariables = Exact<{
  data: IUserOrderCancel
}>

export type CancelOrderMutationMutation = {
  cancelOrder: { data: string | null } | null
}

export type ValidateUserQueryVariables = Exact<{ [key: string]: never }>

export type ValidateUserQuery = { validateUser: { isValid: boolean } | null }

export type ValidateCartMutationMutationVariables = Exact<{
  cart: IStoreCart
  session: IStoreSession
}>

export type ValidateCartMutationMutation = {
  validateCart: {
    order: {
      orderNumber: string
      shouldSplitItem: boolean | null
      acceptedOffer: Array<{
        quantity: number
        price: number
        priceWithTaxes: number
        listPrice: number
        listPriceWithTaxes: number
        seller: { identifier: string }
        itemOffered: {
          sku: string
          name: string
          unitMultiplier: number | null
          gtin: string
          image: Array<{ url: string; alternateName: string }>
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
            valueReference: any
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
  priceWithTaxes: number
  listPrice: number
  listPriceWithTaxes: number
  seller: { identifier: string }
  itemOffered: {
    sku: string
    name: string
    unitMultiplier: number | null
    gtin: string
    image: Array<{ url: string; alternateName: string }>
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
      valueReference: any
    }>
  }
}

export type CartProductItemFragment = {
  sku: string
  name: string
  unitMultiplier: number | null
  gtin: string
  image: Array<{ url: string; alternateName: string }>
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
    valueReference: any
  }>
}

export type SubscribeToNewsletterMutationVariables = Exact<{
  data: IPersonNewsletter
}>

export type SubscribeToNewsletterMutation = {
  subscribeToNewsletter: { id: string } | null
}

export type ClientProductCountQueryQueryVariables = Exact<{
  term: InputMaybe<Scalars['String']['input']>
}>

export type ClientProductCountQueryQuery = {
  productCount: { total: number } | null
}

export type ClientAllVariantProductsQueryQueryVariables = Exact<{
  locator: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type ClientAllVariantProductsQueryQuery = {
  product: {
    id: string
    isVariantOf: {
      name: string
      productGroupID: string
      skuVariants: {
        activeVariations: any | null
        slugsMap: any | null
        availableVariations: any | null
        allVariantProducts: Array<{
          sku: string
          name: string
          image: Array<{ url: string; alternateName: string }>
          offers: {
            highPrice: number
            lowPrice: number
            lowPriceWithTaxes: number
            offerCount: number
            priceCurrency: string
            offers: Array<{
              listPrice: number
              listPriceWithTaxes: number
              sellingPrice: number
              priceCurrency: string
              price: number
              priceWithTaxes: number
              priceValidUntil: string
              itemCondition: string
              availability: string
              quantity: number
            }>
          }
          additionalProperty: Array<{
            propertyID: string
            value: any
            name: string
            valueReference: any
          }>
        }> | null
      } | null
    }
  }
}

export type ClientManyProductsQueryQueryVariables = Exact<{
  first: Scalars['Int']['input']
  after: InputMaybe<Scalars['String']['input']>
  sort: StoreSort
  term: Scalars['String']['input']
  selectedFacets: Array<IStoreSelectedFacet> | IStoreSelectedFacet
  sponsoredCount: InputMaybe<Scalars['Int']['input']>
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
          hasSpecifications: boolean | null
          unitMultiplier: number | null
          id: string
          brand: { name: string; brandName: string }
          isVariantOf: {
            productGroupID: string
            name: string
            skuVariants: {
              allVariantsByName: any | null
              activeVariations: any | null
              slugsMap: any | null
              availableVariations: any | null
              allVariantProducts: Array<{
                name: string
                productID: string
              }> | null
            } | null
          }
          image: Array<{ url: string; alternateName: string }>
          offers: {
            lowPrice: number
            lowPriceWithTaxes: number
            offers: Array<{
              availability: string
              price: number
              listPrice: number
              listPriceWithTaxes: number
              priceWithTaxes: number
              quantity: number
              seller: { identifier: string }
            }>
          }
          additionalProperty: Array<{
            propertyID: string
            name: string
            value: any
            valueReference: any
          }>
          advertisement: { adId: string; adResponseId: string } | null
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
  redirect: { url: string | null } | null
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
      fuzzy: string | null
    } | null
  }
}

export type SearchEvent_MetadataFragment = {
  isTermMisspelled: boolean
  logicalOperator: string
  fuzzy: string | null
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
    unitMultiplier: number | null
    id: string
    isVariantOf: {
      productGroupID: string
      name: string
      skuVariants: {
        activeVariations: any | null
        slugsMap: any | null
        availableVariations: any | null
        allVariantProducts: Array<{ name: string; productID: string }> | null
      } | null
    }
    image: Array<{ url: string; alternateName: string }>
    brand: { name: string }
    offers: {
      lowPrice: number
      lowPriceWithTaxes: number
      offers: Array<{
        availability: string
        price: number
        priceWithTaxes: number
        listPrice: number
        listPriceWithTaxes: number
        seller: { identifier: string }
      }>
    }
    additionalProperty: Array<{
      propertyID: string
      name: string
      value: any
      valueReference: any
    }>
  }
}

export type ClientProfileQueryQueryVariables = Exact<{
  id: Scalars['String']['input']
}>

export type ClientProfileQueryQuery = {
  profile: {
    addresses: Array<{
      country: string | null
      postalCode: string | null
      geoCoordinate: Array<number | null> | null
      city: string | null
    } | null> | null
  } | null
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
        hasSpecifications: boolean | null
        unitMultiplier: number | null
        id: string
        brand: { name: string; brandName: string }
        isVariantOf: {
          productGroupID: string
          name: string
          skuVariants: {
            allVariantsByName: any | null
            activeVariations: any | null
            slugsMap: any | null
            availableVariations: any | null
            allVariantProducts: Array<{
              name: string
              productID: string
            }> | null
          } | null
        }
        image: Array<{ url: string; alternateName: string }>
        offers: {
          lowPrice: number
          lowPriceWithTaxes: number
          offers: Array<{
            availability: string
            price: number
            listPrice: number
            listPriceWithTaxes: number
            priceWithTaxes: number
            quantity: number
            seller: { identifier: string }
          }>
        }
        additionalProperty: Array<{
          propertyID: string
          name: string
          value: any
          valueReference: any
        }>
        advertisement: { adId: string; adResponseId: string } | null
      }>
    }
    products: { pageInfo: { totalCount: number } }
    metadata: {
      isTermMisspelled: boolean
      logicalOperator: string
      fuzzy: string | null
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
    city: string | null
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
    b2b: {
      customerId: string
      isRepresentative: boolean | null
      unitName: string | null
      unitId: string | null
      firstName: string | null
      lastName: string | null
      userName: string | null
      userEmail: string | null
    } | null
    marketingData: {
      utmCampaign: string | null
      utmMedium: string | null
      utmSource: string | null
      utmiCampaign: string | null
      utmiPage: string | null
      utmiPart: string | null
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
        deliveryChannel: string | null
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

export type ServerManyProductsQueryQueryVariables = Exact<{
  first: Scalars['Int']['input']
  after: InputMaybe<Scalars['String']['input']>
  sort: StoreSort
  term: Scalars['String']['input']
  selectedFacets: Array<IStoreSelectedFacet> | IStoreSelectedFacet
  sponsoredCount: InputMaybe<Scalars['Int']['input']>
}>

export type ServerManyProductsQueryQuery = {
  search: {
    products: {
      pageInfo: { totalCount: number }
      edges: Array<{
        node: {
          slug: string
          sku: string
          name: string
          gtin: string
          unitMultiplier: number | null
          id: string
          brand: { name: string; brandName: string }
          isVariantOf: {
            productGroupID: string
            name: string
            skuVariants: {
              allVariantsByName: any | null
              activeVariations: any | null
              slugsMap: any | null
              availableVariations: any | null
            } | null
          }
          image: Array<{ url: string; alternateName: string }>
          offers: {
            lowPrice: number
            lowPriceWithTaxes: number
            offers: Array<{
              availability: string
              price: number
              listPrice: number
              listPriceWithTaxes: number
              priceWithTaxes: number
              quantity: number
              seller: { identifier: string }
            }>
          }
          additionalProperty: Array<{
            propertyID: string
            name: string
            value: any
            valueReference: any
          }>
          advertisement: { adId: string; adResponseId: string } | null
        }
      }>
    }
    metadata: {
      isTermMisspelled: boolean
      logicalOperator: string
      fuzzy: string | null
    } | null
  }
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
  unitMultiplier
  isVariantOf {
    productGroupID
    name
    skuVariants {
      allVariantsByName
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
    lowPriceWithTaxes
    offers {
      availability
      price
      listPrice
      listPriceWithTaxes
      priceWithTaxes
      quantity
      seller {
        identifier
      }
    }
  }
  additionalProperty {
    propertyID
    name
    value
    valueReference
  }
  hasSpecifications
  unitMultiplier
  isVariantOf {
    productGroupID
    name
    skuVariants {
      activeVariations
      slugsMap
      availableVariations
      allVariantProducts {
        name
        productID
      }
    }
  }
  advertisement {
    adId
    adResponseId
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
  unitMultiplier
  image {
    url
    alternateName
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
  unitMultiplier
  isVariantOf {
    name
    productGroupID
    skuVariants {
      activeVariations
      slugsMap
      availableVariations
      allVariantProducts {
        name
        productID
      }
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
    lowPriceWithTaxes
    offers {
      availability
      price
      priceWithTaxes
      listPrice
      listPriceWithTaxes
      seller {
        identifier
      }
    }
  }
  additionalProperty {
    propertyID
    name
    value
    valueReference
  }
  ...CartProductItem
}
    fragment CartProductItem on StoreProduct {
  sku
  name
  unitMultiplier
  image {
    url
    alternateName
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
export const ProductSkuMatrixSidebarFragment_ProductFragmentDoc =
  new TypedDocumentString(
    `
    fragment ProductSKUMatrixSidebarFragment_product on StoreProduct {
  id: productID
  isVariantOf {
    name
    productGroupID
    skuVariants {
      activeVariations
      slugsMap
      availableVariations
      allVariantProducts {
        sku
        name
        image {
          url
          alternateName
        }
        offers {
          highPrice
          lowPrice
          lowPriceWithTaxes
          offerCount
          priceCurrency
          offers {
            listPrice
            listPriceWithTaxes
            sellingPrice
            priceCurrency
            price
            priceWithTaxes
            priceValidUntil
            itemCondition
            availability
            quantity
          }
        }
        additionalProperty {
          propertyID
          value
          name
          valueReference
        }
      }
    }
  }
}
    `,
    { fragmentName: 'ProductSKUMatrixSidebarFragment_product' }
  ) as unknown as TypedDocumentString<
    ProductSkuMatrixSidebarFragment_ProductFragment,
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
    sponsoredCount: $sponsoredCount
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
export const UserOrderItemsFragmentFragmentDoc = new TypedDocumentString(
  `
    fragment UserOrderItemsFragment on UserOrderItems {
  id
  name
  quantity
  sellingPrice
  unitMultiplier
  measurementUnit
  imageUrl
  detailUrl
  refId
  rewardValue
}
    `,
  { fragmentName: 'UserOrderItemsFragment' }
) as unknown as TypedDocumentString<UserOrderItemsFragmentFragment, unknown>
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
  priceWithTaxes
  listPrice
  listPriceWithTaxes
  itemOffered {
    ...CartProductItem
  }
}
    fragment CartProductItem on StoreProduct {
  sku
  name
  unitMultiplier
  image {
    url
    alternateName
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
export const ServerAccountPageQueryDocument = {
  __meta__: {
    operationName: 'ServerAccountPageQuery',
    operationHash: '47315a3cd26ddd9c7fa963778988464341b8193f',
  },
} as unknown as TypedDocumentString<
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables
>
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
    operationHash: 'e855903879c6504e90269e6e010549bc6de933eb',
  },
} as unknown as TypedDocumentString<
  ServerProductQueryQuery,
  ServerProductQueryQueryVariables
>
export const ServerOrderDetailsQueryDocument = {
  __meta__: {
    operationName: 'ServerOrderDetailsQuery',
    operationHash: 'e0fbde45eca1af0aeda0314c5d1c37e8fe520312',
  },
} as unknown as TypedDocumentString<
  ServerOrderDetailsQueryQuery,
  ServerOrderDetailsQueryQueryVariables
>
export const ServerListOrdersQueryDocument = {
  __meta__: {
    operationName: 'ServerListOrdersQuery',
    operationHash: 'ee84ac3f5b58c5e1950a927a42c5c1dd6012fcc4',
  },
} as unknown as TypedDocumentString<
  ServerListOrdersQueryQuery,
  ServerListOrdersQueryQueryVariables
>
export const ServerProfileQueryDocument = {
  __meta__: {
    operationName: 'ServerProfileQuery',
    operationHash: 'c4191223fe0b642eee3aaaa2c56563da7d163265',
  },
} as unknown as TypedDocumentString<
  ServerProfileQueryQuery,
  ServerProfileQueryQueryVariables
>
export const ServerSecurityQueryDocument = {
  __meta__: {
    operationName: 'ServerSecurityQuery',
    operationHash: '9f24767f16e6e05c168336701a6c6c7b6b5dc1c6',
  },
} as unknown as TypedDocumentString<
  ServerSecurityQueryQuery,
  ServerSecurityQueryQueryVariables
>
export const ServerUserDetailsQueryDocument = {
  __meta__: {
    operationName: 'ServerUserDetailsQuery',
    operationHash: '92d9db34aa133d60d474c6d4cdcdd2fc19041a5e',
  },
} as unknown as TypedDocumentString<
  ServerUserDetailsQueryQuery,
  ServerUserDetailsQueryQueryVariables
>
export const CancelOrderMutationDocument = {
  __meta__: {
    operationName: 'CancelOrderMutation',
    operationHash: 'e2b06da6840614d3c72768e56579b9d3b8e80802',
  },
} as unknown as TypedDocumentString<
  CancelOrderMutationMutation,
  CancelOrderMutationMutationVariables
>
export const ValidateUserDocument = {
  __meta__: {
    operationName: 'ValidateUser',
    operationHash: '32f99c73c3de958b64d6bece1afe800469f54548',
  },
} as unknown as TypedDocumentString<
  ValidateUserQuery,
  ValidateUserQueryVariables
>
export const ValidateCartMutationDocument = {
  __meta__: {
    operationName: 'ValidateCartMutation',
    operationHash: 'c2b3f8bff73ebf6ac79d758c66cabbc21ba9fcc0',
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
export const ClientProductCountQueryDocument = {
  __meta__: {
    operationName: 'ClientProductCountQuery',
    operationHash: 'dc912e7272e3d9f5ced206837df87f544d39d0a5',
  },
} as unknown as TypedDocumentString<
  ClientProductCountQueryQuery,
  ClientProductCountQueryQueryVariables
>
export const ClientAllVariantProductsQueryDocument = {
  __meta__: {
    operationName: 'ClientAllVariantProductsQuery',
    operationHash: '4039e05f01a2fe449e20e8b82170d0ba94b1fbe9',
  },
} as unknown as TypedDocumentString<
  ClientAllVariantProductsQueryQuery,
  ClientAllVariantProductsQueryQueryVariables
>
export const ClientManyProductsQueryDocument = {
  __meta__: {
    operationName: 'ClientManyProductsQuery',
    operationHash: '1adc93c70f16173540c50f725ee09a2d67cb85ab',
  },
} as unknown as TypedDocumentString<
  ClientManyProductsQueryQuery,
  ClientManyProductsQueryQueryVariables
>
export const ClientProductGalleryQueryDocument = {
  __meta__: {
    operationName: 'ClientProductGalleryQuery',
    operationHash: 'bfc40da32b60f9404a4adb96b0856e3fbb04b076',
  },
} as unknown as TypedDocumentString<
  ClientProductGalleryQueryQuery,
  ClientProductGalleryQueryQueryVariables
>
export const ClientProductQueryDocument = {
  __meta__: {
    operationName: 'ClientProductQuery',
    operationHash: '47aa22eb750cb2c529e5eeafb921bfeadb67db71',
  },
} as unknown as TypedDocumentString<
  ClientProductQueryQuery,
  ClientProductQueryQueryVariables
>
export const ClientProfileQueryDocument = {
  __meta__: {
    operationName: 'ClientProfileQuery',
    operationHash: '34ea14c0d4a57ddf9bc11e4be0cd2b5a6506d3d4',
  },
} as unknown as TypedDocumentString<
  ClientProfileQueryQuery,
  ClientProfileQueryQueryVariables
>
export const ClientSearchSuggestionsQueryDocument = {
  __meta__: {
    operationName: 'ClientSearchSuggestionsQuery',
    operationHash: 'b548281d477a173be7b6960434604d69769a97e7',
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
    operationHash: '6f6d66826c836c3633a8dc3d2fe8220c386584d6',
  },
} as unknown as TypedDocumentString<
  ValidateSessionMutation,
  ValidateSessionMutationVariables
>
export const ClientShippingSimulationQueryDocument = {
  __meta__: {
    operationName: 'ClientShippingSimulationQuery',
    operationHash: 'c35bad22f67f3eb34fea52bb49efa6b1da6b728d',
  },
} as unknown as TypedDocumentString<
  ClientShippingSimulationQueryQuery,
  ClientShippingSimulationQueryQueryVariables
>
export const ServerManyProductsQueryDocument = {
  __meta__: {
    operationName: 'ServerManyProductsQuery',
    operationHash: '5c2181dde311ca80b72e0cc76ac0855d8aa8b51e',
  },
} as unknown as TypedDocumentString<
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables
>
