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
  /** A string or the string representation of an object (a stringified object). */
  ObjectOrString: any
}

/** Shopping cart input. */
export type IStoreCart = {
  /** Order information, including `orderNumber` and `acceptedOffer`. */
  order: IStoreOrder
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

/** Offer input. */
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
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString']
  /** Specifies the nature of the value */
  valueReference: Scalars['String']
}

/** Selected facet input. */
export type IStoreSelectedFacet = {
  key: Scalars['String']
  value: Scalars['String']
}

/** Session input. */
export type IStoreSession = {
  /** Session input channel. */
  channel: InputMaybe<Scalars['String']>
  /** Session input country. */
  country: InputMaybe<Scalars['String']>
  /** Session input postal code. */
  postalCode: InputMaybe<Scalars['String']>
}

export type Mutation = {
  /** Update session information. */
  updateSession: StoreSession
  /** Returns the order if anything has changed in it, or `null` if the order is valid. */
  validateCart: Maybe<StoreCart>
}

export type MutationUpdateSessionArgs = {
  session: IStoreSession
}

export type MutationValidateCartArgs = {
  cart: IStoreCart
}

export type Query = {
  /** All collections query. */
  allCollections: StoreCollectionConnection
  /** All products query. */
  allProducts: StoreProductConnection
  /** Collection query. */
  collection: StoreCollection
  /** Person query. */
  person: Maybe<StorePerson>
  /** Product query. */
  product: StoreProduct
  /** Search query. */
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
  /** Shopping cart message status, which can be `INFO`, `WARNING` OR `ERROR`. */
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

/** Collection connection pagination information. */
export type StoreCollectionConnection = {
  /** Array with collection connection page edges. */
  edges: Array<StoreCollectionEdge>
  /** Collection connection page information. */
  pageInfo: StorePageInfo
}

/** Collection pagination edge. */
export type StoreCollectionEdge = {
  /** Collection pagination cursor. */
  cursor: Scalars['String']
  /** Collection pagination node. */
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

/** Product collection type. Possible values are `Department`, `Category`, `Brand` or `Cluster`. */
export type StoreCollectionType =
  | 'Brand'
  | 'Category'
  | 'Cluster'
  | 'Department'

/** Search facet information. */
export type StoreFacet = {
  /** Facet key. */
  key: Scalars['String']
  /** Facet label. */
  label: Scalars['String']
  /** Facet type. Possible values are `BOOLEAN` and `RANGE`. */
  type: StoreFacetType
  /** Array with information on each facet value. */
  values: Array<StoreFacetValue>
}

/** Search facet type. */
export type StoreFacetType = 'BOOLEAN' | 'RANGE'

/** Information of a specific facet value. */
export type StoreFacetValue = {
  /** Facet value label. */
  label: Scalars['String']
  /** Number of items with this facet. */
  quantity: Scalars['Int']
  /** Indicates whether facet is selected. */
  selected: Scalars['Boolean']
  /** Facet value. */
  value: Scalars['String']
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

/** Page information. */
export type StorePageInfo = {
  /** Page cursor end. */
  endCursor: Scalars['String']
  /** Indicates whether next page exists. */
  hasNextPage: Scalars['Boolean']
  /** Indicates whether previous page exists. */
  hasPreviousPage: Scalars['Boolean']
  /** Page cursor start. */
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
  /** Array with review information. */
  review: Array<StoreReview>
  /** Meta tag data. */
  seo: StoreSeo
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String']
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String']
}

/** Product connection pagination information. */
export type StoreProductConnection = {
  /** Array with product connection page edges. */
  edges: Array<StoreProductEdge>
  /** Product connection page information. */
  pageInfo: StorePageInfo
}

/** Product pagination edge. */
export type StoreProductEdge = {
  /** Product pagination cursor. */
  cursor: Scalars['String']
  /** Product pagination node. */
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
  country: Maybe<Scalars['String']>
  /** Session postal code. */
  postalCode: Maybe<Scalars['String']>
}

/** Product sorting options used in search. */
export type StoreSort =
  | 'discount_desc'
  | 'name_asc'
  | 'name_desc'
  | 'orders_desc'
  | 'price_asc'
  | 'price_desc'
  | 'release_desc'
  | 'score_desc'

/** Status used to indicate type of message. For instance, in shopping cart messages. */
export type StoreStatus = 'ERROR' | 'INFO' | 'WARNING'

/** Suggestions information. */
export type StoreSuggestions = {
  /** Array with suggestion products' information. */
  products: Maybe<Array<StoreProduct>>
  /** Array with suggestion terms. */
  terms: Maybe<Array<Scalars['String']>>
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

export type UpdateSessionMutationMutationVariables = Exact<{
  session: IStoreSession
}>

export type UpdateSessionMutationMutation = {
  updateSession: { channel: string | null }
}

export type Filter_FacetsFragment = {
  key: string
  label: string
  type: StoreFacetType
  values: Array<{
    label: string
    value: string
    selected: boolean
    quantity: number
  }>
}

export type SearchSuggestionsQueryQueryVariables = Exact<{
  term: Scalars['String']
  selectedFacets: InputMaybe<Array<IStoreSelectedFacet> | IStoreSelectedFacet>
}>

export type SearchSuggestionsQueryQuery = {
  search: {
    suggestions: {
      terms: Array<string> | null
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
      }> | null
    }
  }
}

export type ProductDetailsFragment_ProductFragment = {
  sku: string
  name: string
  gtin: string
  description: string
  id: string
  isVariantOf: { productGroupID: string; name: string }
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
    facets: Array<{
      key: string
      label: string
      type: StoreFacetType
      values: Array<{
        label: string
        value: string
        selected: boolean
        quantity: number
      }>
    }>
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
  id: Scalars['String']
}>

export type ServerProductPageQueryQuery = {
  product: {
    slug: string
    sku: string
    gtin: string
    name: string
    description: string
    id: string
    seo: { title: string; description: string }
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
    isVariantOf: { productGroupID: string; name: string }
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

export type PersonQueryQueryVariables = Exact<{ [key: string]: never }>

export type PersonQueryQuery = {
  person: {
    id: string
    email: string
    givenName: string
    familyName: string
  } | null
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
    isVariantOf: { productGroupID: string; name: string }
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
