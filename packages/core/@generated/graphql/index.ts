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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: 'Red', Size: '42'
   * }
   * ```
   */
  ActiveVariations: any
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
  FormattedVariants: any
  /** A string or the string representation of an object (a stringified object). */
  ObjectOrString: any
  /**
   * Example:
   *
   * ```json
   * {
   *   'Color-Red-Size-40': 'classic-shoes-37'
   * }
   * ```
   */
  SlugsMap: any
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
  VariantsByName: any
}

/** Person data input to the newsletter. */
export type IPersonNewsletter = {
  /** Person's email. */
  email: Scalars['String']
  /** Person's name. */
  name: Scalars['String']
}

/** Shopping cart input. */
export type IStoreCart = {
  /** Order information, including `orderNumber` and `acceptedOffer`. */
  order: IStoreOrder
}

export type IStoreCurrency = {
  /** Currency code (e.g: USD). */
  code: Scalars['String']
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String']
}

/** Image input. */
export type IStoreImage = {
  /** Alias for the input image. */
  alternateName: Scalars['String']
  /** Image input URL. */
  url: Scalars['String']
}

/** Offer input. */
export type IStoreOffer = {
  /** Information on the item being offered. */
  itemOffered: IStoreProduct
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float']
  /** Also known as spot price. */
  price: Scalars['Float']
  /** Number of items offered. */
  quantity: Scalars['Int']
  /** Seller responsible for the offer. */
  seller: IStoreOrganization
}

/** Order input. */
export type IStoreOrder = {
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<IStoreOffer>
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String']
}

/** Organization input. */
export type IStoreOrganization = {
  /** Organization ID. */
  identifier: Scalars['String']
}

/** Client profile data. */
export type IStorePerson = {
  /** Client email. */
  email: Scalars['String']
  /** Client last name. */
  familyName: Scalars['String']
  /** Client first name. */
  givenName: Scalars['String']
  /** Client ID. */
  id: Scalars['String']
}

/** Product input. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type IStoreProduct = {
  /** Custom Product Additional Properties. */
  additionalProperty: InputMaybe<Array<IStorePropertyValue>>
  /** Array of product images. */
  image: Array<IStoreImage>
  /** Product name. */
  name: Scalars['String']
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String']
}

export type IStorePropertyValue = {
  /** Property name. */
  name: Scalars['String']
  /** Property id. This propert changes according to the content of the object. */
  propertyID: InputMaybe<Scalars['String']>
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString']
  /** Specifies the nature of the value */
  valueReference: Scalars['String']
}

/** Selected search facet input. */
export type IStoreSelectedFacet = {
  /** Selected search facet key. */
  key: Scalars['String']
  /** Selected search facet value. */
  value: Scalars['String']
}

/** Session input. */
export type IStoreSession = {
  /** Session input channel. */
  channel: InputMaybe<Scalars['String']>
  /** Session input country. */
  country: Scalars['String']
  /** Session input currency. */
  currency: IStoreCurrency
  /** Session input locale. */
  locale: Scalars['String']
  /** Session input postal code. */
  person: InputMaybe<IStorePerson>
  /** Session input postal code. */
  postalCode: InputMaybe<Scalars['String']>
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
  search: Scalars['String']
  session: IStoreSession
}

/** Newsletter information. */
export type PersonNewsletter = {
  /** Person's ID in the newsletter list. */
  id: Scalars['String']
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
  /** Returns the result of a product, facet, or suggestion search. */
  search: StoreSearchResult
}

export type QueryAllCollectionsArgs = {
  after: InputMaybe<Scalars['String']>
  first: Scalars['Int']
}

export type QueryAllProductsArgs = {
  after: InputMaybe<Scalars['String']>
  first: Scalars['Int']
}

export type QueryCollectionArgs = {
  slug: Scalars['String']
}

export type QueryProductArgs = {
  locator: Array<IStoreSelectedFacet>
}

export type QuerySearchArgs = {
  after: InputMaybe<Scalars['String']>
  first: Scalars['Int']
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet>>
  sort?: InputMaybe<StoreSort>
  term?: InputMaybe<Scalars['String']>
}

export type SkuVariants = {
  /** SKU property values for the current SKU. */
  activeVariations: Maybe<Scalars['ActiveVariations']>
  /** All available options for each SKU variant property, indexed by their name. */
  allVariantsByName: Maybe<Scalars['VariantsByName']>
  /**
   * Available options for each varying SKU property, taking into account the
   * `dominantVariantName` property. Returns all available options for the
   * dominant property, and only options that can be combined with its current
   * value for other properties.
   */
  availableVariations: Maybe<Scalars['FormattedVariants']>
  /**
   * Maps property value combinations to their respective SKU's slug. Enables
   * us to retrieve the slug for the SKU that matches the currently selected
   * variations in O(1) time.
   */
  slugsMap: Maybe<Scalars['SlugsMap']>
}

export type SkuVariantsAvailableVariationsArgs = {
  dominantVariantName: Scalars['String']
}

export type SkuVariantsSlugsMapArgs = {
  dominantVariantName: Scalars['String']
}

/** Aggregate offer information, for a given SKU that is available to be fulfilled by multiple sellers. */
export type StoreAggregateOffer = {
  /** Highest price among all sellers. */
  highPrice: Scalars['Float']
  /** Lowest price among all sellers. */
  lowPrice: Scalars['Float']
  /** Number of sellers selling this SKU. */
  offerCount: Scalars['Int']
  /** Array with information on each available offer. */
  offers: Array<StoreOffer>
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String']
}

/** Average rating, based on multiple ratings or reviews. */
export type StoreAggregateRating = {
  /** Value of the aggregate rating. */
  ratingValue: Scalars['Float']
  /** Total number of ratings. */
  reviewCount: Scalars['Int']
}

/** information about the author of a product review or rating. */
export type StoreAuthor = {
  /** Author name. */
  name: Scalars['String']
}

/** Brand of a given product. */
export type StoreBrand = {
  /** Brand name. */
  name: Scalars['String']
}

/** List of items consisting of chain linked web pages, ending with the current page. */
export type StoreBreadcrumbList = {
  /** Array with breadcrumb elements. */
  itemListElement: Array<StoreListItem>
  /** Number of breadcrumbs in the list. */
  numberOfItems: Scalars['Int']
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
  text: Scalars['String']
}

/** Product collection information. */
export type StoreCollection = {
  /** List of items consisting of chain linked web pages, ending with the current page. */
  breadcrumbList: StoreBreadcrumbList
  /** Collection ID. */
  id: Scalars['ID']
  /** Collection meta information. Used for search. */
  meta: StoreCollectionMeta
  /** Meta tag data. */
  seo: StoreSeo
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String']
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
  cursor: Scalars['String']
  /** Each collection node contains the information of a product collection returned by the query. */
  node: StoreCollection
}

/** Product collection facet, used for search. */
export type StoreCollectionFacet = {
  /** Facet key. */
  key: Scalars['String']
  /** Facet value. */
  value: Scalars['String']
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
  code: Scalars['String']
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String']
}

export type StoreFacet = StoreFacetBoolean | StoreFacetRange

/** Search facet boolean information. */
export type StoreFacetBoolean = {
  /** Facet key. */
  key: Scalars['String']
  /** Facet label. */
  label: Scalars['String']
  /** Array with information on each facet value. */
  values: Array<StoreFacetValueBoolean>
}

/** Search facet range information. */
export type StoreFacetRange = {
  /** Facet key. */
  key: Scalars['String']
  /** Facet label. */
  label: Scalars['String']
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
  label: Scalars['String']
  /** Number of items with this facet. */
  quantity: Scalars['Int']
  /** Indicates whether facet is selected. */
  selected: Scalars['Boolean']
  /** Facet value. */
  value: Scalars['String']
}

/** Search facet range value information. Used for minimum and maximum range values. */
export type StoreFacetValueRange = {
  /** Search facet range absolute value. */
  absolute: Scalars['Float']
  /** Search facet range selected value. */
  selected: Scalars['Float']
}

/** Image. */
export type StoreImage = {
  /** Alias for the image. */
  alternateName: Scalars['String']
  /** Image URL. */
  url: Scalars['String']
}

/** Item of a list. */
export type StoreListItem = {
  /** List item value. */
  item: Scalars['String']
  /** Name of the list item. */
  name: Scalars['String']
  /** Position of the item in the list. */
  position: Scalars['Int']
}

/** Offer information. */
export type StoreOffer = {
  /** Offer item availability. */
  availability: Scalars['String']
  /** Offer item condition. */
  itemCondition: Scalars['String']
  /** Information on the item being offered. */
  itemOffered: StoreProduct
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float']
  /** Also known as spot price. */
  price: Scalars['Float']
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String']
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil: Scalars['String']
  /** Number of items offered. */
  quantity: Scalars['Int']
  /** Seller responsible for the offer. */
  seller: StoreOrganization
  /** Computed price before applying coupons, taxes or benefits. This may change before it reaches the shelf. */
  sellingPrice: Scalars['Float']
}

/** Information of a specific order. */
export type StoreOrder = {
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<StoreOffer>
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String']
}

/** Organization. */
export type StoreOrganization = {
  /** Organization ID. */
  identifier: Scalars['String']
}

/** Whenever you make a query that allows for pagination, such as `allProducts` or `allCollections`, you can check `StorePageInfo` to learn more about the complete set of items and use it to paginate your queries. */
export type StorePageInfo = {
  /** Cursor corresponding to the last possible item. */
  endCursor: Scalars['String']
  /** Indicates whether there is at least one more page with items after the ones returned in the current query. */
  hasNextPage: Scalars['Boolean']
  /** Indicates whether there is at least one more page with items before the ones returned in the current query. */
  hasPreviousPage: Scalars['Boolean']
  /** Cursor corresponding to the first possible item. */
  startCursor: Scalars['String']
  /** Total number of items (products or collections), not pages. */
  totalCount: Scalars['Int']
}

/** Client profile data. */
export type StorePerson = {
  /** Client email. */
  email: Scalars['String']
  /** Client last name. */
  familyName: Scalars['String']
  /** Client first name. */
  givenName: Scalars['String']
  /** Client ID. */
  id: Scalars['String']
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
  description: Scalars['String']
  /** Global Trade Item Number. */
  gtin: Scalars['String']
  /** Array of images. */
  image: Array<StoreImage>
  /** Indicates product group related to this product. */
  isVariantOf: StoreProductGroup
  /** Product name. */
  name: Scalars['String']
  /** Aggregate offer information. */
  offers: StoreAggregateOffer
  /** Product ID, such as [ISBN](https://www.isbn-international.org/content/what-isbn) or similar global IDs. */
  productID: Scalars['String']
  /** The product's release date. Formatted using https://en.wikipedia.org/wiki/ISO_8601 */
  releaseDate: Scalars['String']
  /** Array with review information. */
  review: Array<StoreReview>
  /** Meta tag data. */
  seo: StoreSeo
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String']
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String']
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
  cursor: Scalars['String']
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
  name: Scalars['String']
  /** Product group ID. */
  productGroupID: Scalars['String']
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
  name: Scalars['String']
  /** Property id. This propert changes according to the content of the object. */
  propertyID: Scalars['String']
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString']
  /** Specifies the nature of the value */
  valueReference: Scalars['String']
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
  bestRating: Scalars['Float']
  /** Rating value. */
  ratingValue: Scalars['Float']
}

/** Search result. */
export type StoreSearchResult = {
  /** Array of search result facets. */
  facets: Array<StoreFacet>
  /** Search result products. */
  products: StoreProductConnection
  /** Search result suggestions. */
  suggestions: StoreSuggestions
}

/** Search Engine Optimization (SEO) tags data. */
export type StoreSeo = {
  /** Canonical tag. */
  canonical: Scalars['String']
  /** Description tag. */
  description: Scalars['String']
  /** Title tag. */
  title: Scalars['String']
  /** Title template tag. */
  titleTemplate: Scalars['String']
}

/** Session information. */
export type StoreSession = {
  /** Session channel. */
  channel: Maybe<Scalars['String']>
  /** Session country. */
  country: Scalars['String']
  /** Session currency. */
  currency: StoreCurrency
  /** Session locale. */
  locale: Scalars['String']
  /** Session postal code. */
  person: Maybe<StorePerson>
  /** Session postal code. */
  postalCode: Maybe<Scalars['String']>
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
  count: Scalars['Int']
  /** The term. */
  value: Scalars['String']
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

export type Filter_Facets_StoreFacetBoolean_Fragment = {
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

export type Filter_Facets_StoreFacetRange_Fragment = {
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
  image: Array<{ url: string; alternateName: string }>
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
  breadcrumbList: {
    itemListElement: Array<{ item: string; name: string; position: number }>
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: any
    valueReference: string
  }>
}

export type ProductGalleryQueryQueryVariables = Exact<{
  first: Scalars['Int']
  after: Scalars['String']
  sort: StoreSort
  term: Scalars['String']
  selectedFacets: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type ProductGalleryQueryQuery = {
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
  }
}

export type ServerCollectionPageQueryQueryVariables = Exact<{
  slug: Scalars['String']
}>

export type ServerCollectionPageQueryQuery = {
  collection: {
    seo: { title: string; description: string }
    breadcrumbList: {
      itemListElement: Array<{ item: string; name: string; position: number }>
    }
    meta: { selectedFacets: Array<{ key: string; value: string }> }
  }
}

export type ServerProductPageQueryQueryVariables = Exact<{
  slug: Scalars['String']
}>

export type ServerProductPageQueryQuery = {
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
    image: Array<{ url: string; alternateName: string }>
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
          image: Array<{ url: string; alternateName: string }>
          brand: { name: string }
          isVariantOf: { productGroupID: string; name: string }
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
    image: Array<{ url: string; alternateName: string }>
    brand: { name: string }
    isVariantOf: { productGroupID: string; name: string }
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
  image: Array<{ url: string; alternateName: string }>
  brand: { name: string }
  isVariantOf: { productGroupID: string; name: string }
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

export type BrowserProductQueryQueryVariables = Exact<{
  locator: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type BrowserProductQueryQuery = {
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
    image: Array<{ url: string; alternateName: string }>
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
    breadcrumbList: {
      itemListElement: Array<{ item: string; name: string; position: number }>
    }
    additionalProperty: Array<{
      propertyID: string
      name: string
      value: any
      valueReference: string
    }>
  }
}

export type ProductsQueryQueryVariables = Exact<{
  first: Scalars['Int']
  after: InputMaybe<Scalars['String']>
  sort: StoreSort
  term: Scalars['String']
  selectedFacets: Array<IStoreSelectedFacet> | IStoreSelectedFacet
}>

export type ProductsQueryQuery = {
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

export type SearchSuggestionsQueryQueryVariables = Exact<{
  term: Scalars['String']
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet> | IStoreSelectedFacet>
}>

export type SearchSuggestionsQueryQuery = {
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
  }
}

export type TopSearchSuggestionsQueryQueryVariables = Exact<{
  term: Scalars['String']
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet> | IStoreSelectedFacet>
}>

export type TopSearchSuggestionsQueryQuery = {
  search: { suggestions: { terms: Array<{ value: string }> } }
}

export type ValidateSessionMutationVariables = Exact<{
  session: IStoreSession
  search: Scalars['String']
}>

export type ValidateSessionMutation = {
  validateSession: {
    locale: string
    channel: string | null
    country: string
    postalCode: string | null
    currency: { code: string; symbol: string }
    person: {
      id: string
      email: string
      givenName: string
      familyName: string
    } | null
  } | null
}
