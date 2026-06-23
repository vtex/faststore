import { gql } from '@faststore/core/api'
import type { RecommendationResponse } from '@generated/graphql'
import { useQuery } from './queries/useQuery'

const query = gql(`query FetchRecommendationsQuery(
  $campaignVrn: String!
  $userId: String
  $products: [String!]
) {
  recommendations(
    userId: $userId
    campaignVrn: $campaignVrn
    products: $products
  ) {
    products {
      cacheId
      productId
      description
      productName
      productReference
      linkText
      brand
      brandId
      link
      categories
      categoryId
      releaseDate
      advertisement {
        adId
        campaignId
        actionCost
        adRequestId
        adResponseId
      }
      priceRange {
        sellingPrice {
          highPrice
          lowPrice
        }
        listPrice {
          highPrice
          lowPrice
        }
      }
      specificationGroups {
        name
        originalName
        specifications {
          name
          originalName
          values
        }
      }
      skuSpecifications {
        field {
          name
          originalName
        }
        values {
          name
          originalName
        }
      }
      productClusters {
        id
        name
      }
      clusterHighlights {
        id
        name
      }
      properties {
        name
        values
      }
      items {
        itemId
        name
        nameComplete
        complementName
        ean
        variations {
          name
          values
        }
        referenceId {
          Key
          Value
        }
        measurementUnit
        unitMultiplier
        images {
          cacheId
          imageId
          imageLabel
          imageTag
          imageUrl
          imageText
        }
        sellers {
          sellerId
          sellerName
          sellerDefault
          commertialOffer {
            discountHighlights {
              name
            }
            teasers {
              name
              conditions {
                minimumQuantity
                parameters {
                  name
                  value
                }
              }
              effects {
                parameters {
                  name
                  value
                }
              }
            }
            Price
            ListPrice
            Tax
            taxPercentage
            spotPrice
            PriceWithoutDiscount
            RewardValue
            PriceValidUntil
            AvailableQuantity
            Installments {
              Value
              InterestRate
              TotalValuePlusInterestRate
              NumberOfInstallments
              Name
              PaymentSystemName
            }
          }
        }
      }
    }
    correlationId
    campaign {
      id
      title
      type
    }
  }
}
`)

export type RecommendationInput = {
  userId: string
  campaignVrn: string
  products: string[]
}

export const useRecommendations = (args: RecommendationInput | null) => {
  const { data, isLoading, error } = useQuery<
    { recommendations: RecommendationResponse },
    RecommendationInput
  >(query, args ?? ({} as RecommendationInput), {
    doNotRun: args === null,
  })

  return {
    data: data?.recommendations,
    error,
    isLoading,
  }
}
