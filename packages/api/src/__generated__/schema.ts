export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type IStoreCart = {
  order: IStoreOrder;
};

export type IStoreImage = {
  alternateName: Scalars['String'];
  url: Scalars['String'];
};

export type IStoreOffer = {
  itemOffered: IStoreProduct;
  listPrice: Scalars['Float'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  seller: IStoreOrganization;
};

export type IStoreOrder = {
  acceptedOffer: Array<IStoreOffer>;
  orderNumber: Scalars['String'];
};

export type IStoreOrganization = {
  identifier: Scalars['String'];
};

export type IStoreProduct = {
  image: Array<IStoreImage>;
  name: Scalars['String'];
  sku: Scalars['String'];
};

export type IStoreSelectedFacet = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  validateCart?: Maybe<StoreCart>;
};


export type MutationValidateCartArgs = {
  cart: IStoreCart;
};

export type Query = {
  __typename?: 'Query';
  allCollections: StoreCollectionConnection;
  allProducts: StoreProductConnection;
  collection: StoreCollection;
  product: StoreProduct;
  search: StoreSearchResult;
};


export type QueryAllCollectionsArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryAllProductsArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryCollectionArgs = {
  slug: Scalars['String'];
};


export type QueryProductArgs = {
  locator: Array<IStoreSelectedFacet>;
};


export type QuerySearchArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
  selectedFacets?: Maybe<Array<IStoreSelectedFacet>>;
  sort?: Maybe<StoreSort>;
  term?: Maybe<Scalars['String']>;
};

export type StoreAggregateOffer = {
  __typename?: 'StoreAggregateOffer';
  highPrice: Scalars['Float'];
  lowPrice: Scalars['Float'];
  offerCount: Scalars['Int'];
  offers: Array<StoreOffer>;
  priceCurrency: Scalars['String'];
};

export type StoreAggregateRating = {
  __typename?: 'StoreAggregateRating';
  ratingValue: Scalars['Float'];
  reviewCount: Scalars['Int'];
};

export type StoreAuthor = {
  __typename?: 'StoreAuthor';
  name: Scalars['String'];
};

export type StoreBrand = {
  __typename?: 'StoreBrand';
  name: Scalars['String'];
};

export type StoreBreadcrumbList = {
  __typename?: 'StoreBreadcrumbList';
  itemListElement: Array<StoreListItem>;
  numberOfItems: Scalars['Int'];
};

export type StoreCart = {
  __typename?: 'StoreCart';
  messages: Array<StoreCartMessage>;
  order: StoreOrder;
};

export type StoreCartMessage = {
  __typename?: 'StoreCartMessage';
  status: StoreStatus;
  text: Scalars['String'];
};

export type StoreCollection = {
  __typename?: 'StoreCollection';
  breadcrumbList: StoreBreadcrumbList;
  id: Scalars['ID'];
  meta: StoreCollectionMeta;
  seo: StoreSeo;
  slug: Scalars['String'];
  type: StoreCollectionType;
};

export type StoreCollectionConnection = {
  __typename?: 'StoreCollectionConnection';
  edges: Array<StoreCollectionEdge>;
  pageInfo: StorePageInfo;
};

export type StoreCollectionEdge = {
  __typename?: 'StoreCollectionEdge';
  cursor: Scalars['String'];
  node: StoreCollection;
};

export type StoreCollectionFacet = {
  __typename?: 'StoreCollectionFacet';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type StoreCollectionMeta = {
  __typename?: 'StoreCollectionMeta';
  selectedFacets: Array<StoreCollectionFacet>;
};

export const enum StoreCollectionType {
  Brand = 'Brand',
  Category = 'Category',
  Cluster = 'Cluster',
  Department = 'Department'
};

export type StoreFacet = {
  __typename?: 'StoreFacet';
  key: Scalars['String'];
  label: Scalars['String'];
  type: StoreFacetType;
  values: Array<StoreFacetValue>;
};

export const enum StoreFacetType {
  Boolean = 'BOOLEAN',
  Range = 'RANGE'
};

export type StoreFacetValue = {
  __typename?: 'StoreFacetValue';
  label: Scalars['String'];
  quantity: Scalars['Int'];
  selected: Scalars['Boolean'];
  value: Scalars['String'];
};

export type StoreImage = {
  __typename?: 'StoreImage';
  alternateName: Scalars['String'];
  url: Scalars['String'];
};

export type StoreListItem = {
  __typename?: 'StoreListItem';
  item: Scalars['String'];
  name: Scalars['String'];
  position: Scalars['Int'];
};

export type StoreOffer = {
  __typename?: 'StoreOffer';
  availability: Scalars['String'];
  itemCondition: Scalars['String'];
  itemOffered: StoreProduct;
  listPrice: Scalars['Float'];
  price: Scalars['Float'];
  priceCurrency: Scalars['String'];
  priceValidUntil: Scalars['String'];
  quantity: Scalars['Int'];
  seller: StoreOrganization;
  sellingPrice: Scalars['Float'];
};

export type StoreOrder = {
  __typename?: 'StoreOrder';
  acceptedOffer: Array<StoreOffer>;
  orderNumber: Scalars['String'];
};

export type StoreOrganization = {
  __typename?: 'StoreOrganization';
  identifier: Scalars['String'];
};

export type StorePageInfo = {
  __typename?: 'StorePageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
  totalCount: Scalars['Int'];
};

export type StoreProduct = {
  __typename?: 'StoreProduct';
  aggregateRating: StoreAggregateRating;
  brand: StoreBrand;
  breadcrumbList: StoreBreadcrumbList;
  description: Scalars['String'];
  gtin: Scalars['String'];
  image: Array<StoreImage>;
  isVariantOf: StoreProductGroup;
  name: Scalars['String'];
  offers: StoreAggregateOffer;
  productID: Scalars['String'];
  review: Array<StoreReview>;
  seo: StoreSeo;
  sku: Scalars['String'];
  slug: Scalars['String'];
};

export type StoreProductConnection = {
  __typename?: 'StoreProductConnection';
  edges: Array<StoreProductEdge>;
  pageInfo: StorePageInfo;
};

export type StoreProductEdge = {
  __typename?: 'StoreProductEdge';
  cursor: Scalars['String'];
  node: StoreProduct;
};

export type StoreProductGroup = {
  __typename?: 'StoreProductGroup';
  hasVariant: Array<StoreProduct>;
  name: Scalars['String'];
  productGroupID: Scalars['String'];
};

export type StoreReview = {
  __typename?: 'StoreReview';
  author: StoreAuthor;
  reviewRating: StoreReviewRating;
};

export type StoreReviewRating = {
  __typename?: 'StoreReviewRating';
  bestRating: Scalars['Float'];
  ratingValue: Scalars['Float'];
};

export type StoreSearchResult = {
  __typename?: 'StoreSearchResult';
  facets: Array<StoreFacet>;
  products: StoreProductConnection;
};

export type StoreSeo = {
  __typename?: 'StoreSeo';
  canonical: Scalars['String'];
  description: Scalars['String'];
  title: Scalars['String'];
  titleTemplate: Scalars['String'];
};

export const enum StoreSort {
  DiscountDesc = 'discount_desc',
  NameAsc = 'name_asc',
  NameDesc = 'name_desc',
  OrdersDesc = 'orders_desc',
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  ReleaseDesc = 'release_desc',
  ScoreDesc = 'score_desc'
};

export const enum StoreStatus {
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING'
};
