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
}

export type IStoreCart = {
  order: IStoreOrder
}

export type IStoreImage = {
  alternateName: Scalars['String']
  url: Scalars['String']
}

export type IStoreOffer = {
  itemOffered: IStoreProduct
  listPrice: Scalars['Float']
  price: Scalars['Float']
  quantity: Scalars['Int']
  seller: IStoreOrganization
}

export type IStoreOrder = {
  acceptedOffer: Array<IStoreOffer>
  orderNumber: Scalars['String']
}

export type IStoreOrganization = {
  identifier: Scalars['String']
}

export type IStoreProduct = {
  image: Array<IStoreImage>
  name: Scalars['String']
  sku: Scalars['String']
}

export type IStoreSelectedFacet = {
  key: Scalars['String']
  value: Scalars['String']
}

export type IStoreSession = {
  channel: InputMaybe<Scalars['String']>
  country: InputMaybe<Scalars['String']>
  postalCode: InputMaybe<Scalars['String']>
}

export type Mutation = {
  updateSession: StoreSession
  validateCart: Maybe<StoreCart>
}

export type MutationUpdateSessionArgs = {
  session: IStoreSession
}

export type MutationValidateCartArgs = {
  cart: IStoreCart
}

export type Query = {
  allCollections: StoreCollectionConnection
  allProducts: StoreProductConnection
  collection: StoreCollection
  person: Maybe<StorePerson>
  product: StoreProduct
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

export type StoreAggregateOffer = {
  highPrice: Scalars['Float']
  lowPrice: Scalars['Float']
  offerCount: Scalars['Int']
  offers: Array<StoreOffer>
  priceCurrency: Scalars['String']
}

export type StoreAggregateRating = {
  ratingValue: Scalars['Float']
  reviewCount: Scalars['Int']
}

export type StoreAuthor = {
  name: Scalars['String']
}

export type StoreBrand = {
  name: Scalars['String']
}

export type StoreBreadcrumbList = {
  itemListElement: Array<StoreListItem>
  numberOfItems: Scalars['Int']
}

export type StoreCart = {
  messages: Array<StoreCartMessage>
  order: StoreOrder
}

export type StoreCartMessage = {
  status: StoreStatus
  text: Scalars['String']
}

export type StoreCollection = {
  breadcrumbList: StoreBreadcrumbList
  id: Scalars['ID']
  meta: StoreCollectionMeta
  seo: StoreSeo
  slug: Scalars['String']
  type: StoreCollectionType
}

export type StoreCollectionConnection = {
  edges: Array<StoreCollectionEdge>
  pageInfo: StorePageInfo
}

export type StoreCollectionEdge = {
  cursor: Scalars['String']
  node: StoreCollection
}

export type StoreCollectionFacet = {
  key: Scalars['String']
  value: Scalars['String']
}

export type StoreCollectionMeta = {
  selectedFacets: Array<StoreCollectionFacet>
}

export type StoreCollectionType =
  | 'Brand'
  | 'Category'
  | 'Cluster'
  | 'Department'

export type StoreFacet = {
  key: Scalars['String']
  label: Scalars['String']
  type: StoreFacetType
  values: Array<StoreFacetValue>
}

export type StoreFacetType = 'BOOLEAN' | 'RANGE'

export type StoreFacetValue = {
  label: Scalars['String']
  quantity: Scalars['Int']
  selected: Scalars['Boolean']
  value: Scalars['String']
}

export type StoreImage = {
  alternateName: Scalars['String']
  url: Scalars['String']
}

export type StoreListItem = {
  item: Scalars['String']
  name: Scalars['String']
  position: Scalars['Int']
}

export type StoreOffer = {
  availability: Scalars['String']
  itemCondition: Scalars['String']
  itemOffered: StoreProduct
  listPrice: Scalars['Float']
  price: Scalars['Float']
  priceCurrency: Scalars['String']
  priceValidUntil: Scalars['String']
  quantity: Scalars['Int']
  seller: StoreOrganization
  sellingPrice: Scalars['Float']
}

export type StoreOrder = {
  acceptedOffer: Array<StoreOffer>
  orderNumber: Scalars['String']
}

export type StoreOrganization = {
  identifier: Scalars['String']
}

export type StorePageInfo = {
  endCursor: Scalars['String']
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor: Scalars['String']
  totalCount: Scalars['Int']
}

export type StorePerson = {
  email: Scalars['String']
  familyName: Scalars['String']
  givenName: Scalars['String']
  id: Scalars['String']
}

export type StoreProduct = {
  additionalProperty: Array<StorePropertyValue>
  aggregateRating: StoreAggregateRating
  brand: StoreBrand
  breadcrumbList: StoreBreadcrumbList
  description: Scalars['String']
  gtin: Scalars['String']
  image: Array<StoreImage>
  isVariantOf: StoreProductGroup
  name: Scalars['String']
  offers: StoreAggregateOffer
  productID: Scalars['String']
  review: Array<StoreReview>
  seo: StoreSeo
  sku: Scalars['String']
  slug: Scalars['String']
}

export type StoreProductConnection = {
  edges: Array<StoreProductEdge>
  pageInfo: StorePageInfo
}

export type StoreProductEdge = {
  cursor: Scalars['String']
  node: StoreProduct
}

export type StoreProductGroup = {
  additionalProperty: Array<StorePropertyValue>
  hasVariant: Array<StoreProduct>
  name: Scalars['String']
  productGroupID: Scalars['String']
}

export type StorePropertyValue = {
  name: Scalars['String']
  value: Scalars['String']
}

export type StoreReview = {
  author: StoreAuthor
  reviewRating: StoreReviewRating
}

export type StoreReviewRating = {
  bestRating: Scalars['Float']
  ratingValue: Scalars['Float']
}

export type StoreSearchResult = {
  facets: Array<StoreFacet>
  products: StoreProductConnection
}

export type StoreSeo = {
  canonical: Scalars['String']
  description: Scalars['String']
  title: Scalars['String']
  titleTemplate: Scalars['String']
}

export type StoreSession = {
  channel: Maybe<Scalars['String']>
  country: Maybe<Scalars['String']>
  postalCode: Maybe<Scalars['String']>
}

export type StoreSort =
  | 'discount_desc'
  | 'name_asc'
  | 'name_desc'
  | 'orders_desc'
  | 'price_asc'
  | 'price_desc'
  | 'release_desc'
  | 'score_desc'

export type StoreStatus = 'ERROR' | 'INFO' | 'WARNING'

export type UpdateSessionMutationMutationVariables = Exact<{
  session: IStoreSession
}>

export type UpdateSessionMutationMutation = {
  updateSession: { channel: string | null }
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
