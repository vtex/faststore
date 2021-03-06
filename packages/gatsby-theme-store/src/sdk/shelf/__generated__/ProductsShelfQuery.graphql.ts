
/**
 * Warning: This is an autogenerated file.
 *
 * Changes in this file won't take effect and will be overwritten
 */

// Base Types
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type Maybe<T> = T | null | undefined
type Scalars = {
  Boolean: boolean
  String: string
  Float: number
  Int: number
  ID: string
}

// Operation related types
export type ProductsShelfQueryQueryVariables = Exact<{
  simulationBehavior?: Maybe<Vtex_SimulationBehavior>;
  hideUnavailableItems?: Maybe<Scalars['Boolean']>;
  salesChannel?: Maybe<Scalars['String']>;
  collection: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Scalars['String']>;
  query: Maybe<Scalars['String']>;
  map: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['Int']>;
}>;


export type ProductsShelfQueryQuery = { vtex: { products: Maybe<Array<Maybe<{ productId: Maybe<string>, productName: Maybe<string>, linkText: Maybe<string>, productClusters: Maybe<Array<Maybe<{ name: Maybe<string> }>>>, items: Maybe<Array<Maybe<{ itemId: Maybe<string>, images: Maybe<Array<Maybe<{ imageUrl: Maybe<string>, imageText: Maybe<string> }>>>, sellers: Maybe<Array<Maybe<{ sellerId: Maybe<string>, commercialOffer: Maybe<{ spotPrice: Maybe<number>, availableQuantity: Maybe<number>, price: Maybe<number>, listPrice: Maybe<number>, maxInstallments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number> }>>>, installments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number>, interestRate: Maybe<number> }>>>, teasers: Maybe<Array<{ name: Maybe<string> }>> }> }>>> }>>> }>>> } };


// Query Related Code

export const ProductsShelfQuery = {
  query: undefined,
  sha256Hash: "218493321a38cbdf90ec8fd5b6a32e26d61ac5b8c82fc6a674bdd0b2bddf379b",
  operationName: "ProductsShelfQuery",
}

