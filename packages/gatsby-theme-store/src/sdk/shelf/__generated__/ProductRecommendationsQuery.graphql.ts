
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
export type ProductRecommendationsQueryQueryVariables = Exact<{
  identifier: Vtex_ProductUniqueIdentifier;
  type: Vtex_CrossSelingInputEnum;
}>;


export type ProductRecommendationsQueryQuery = { vtex: { productRecommendations: Maybe<Array<Maybe<{ productId: Maybe<string>, productName: Maybe<string>, linkText: Maybe<string>, productClusters: Maybe<Array<Maybe<{ name: Maybe<string> }>>>, items: Maybe<Array<Maybe<{ itemId: Maybe<string>, images: Maybe<Array<Maybe<{ imageUrl: Maybe<string>, imageText: Maybe<string> }>>>, sellers: Maybe<Array<Maybe<{ sellerId: Maybe<string>, commercialOffer: Maybe<{ spotPrice: Maybe<number>, availableQuantity: Maybe<number>, price: Maybe<number>, listPrice: Maybe<number>, maxInstallments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number> }>>>, installments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number>, interestRate: Maybe<number> }>>>, teasers: Maybe<Array<{ name: Maybe<string> }>> }> }>>> }>>> }>>> } };


// Query Related Code

export const ProductRecommendationsQuery = {
  query: undefined,
  sha256Hash: "2b8ebda39d574d52594d3e1d900072d12b68cc40632b663a856fc814a3471b57",
  operationName: "ProductRecommendationsQuery",
}

