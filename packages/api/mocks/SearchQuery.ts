export const SearchQueryFirst5Products = `query SearchQuery {
  search(first: 5, selectedFacets: [{key: "category-1", value: "office"}]) {
    products {
      pageInfo {
        totalCount
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          name
          slug
          sku
          productID
          description
          sku
          gtin
          brand {
            name
          }
          image {
            url
            alternateName
          }
          offers {
            highPrice
            lowPrice
            offerCount
            priceCurrency
            offers {
              listPrice
              sellingPrice
              price
              itemCondition
              availability
              quantity
              seller {
                identifier
              }
              itemOffered {
                seo {
                  title
                  titleTemplate
                  description
                  canonical
                }
              }
            }
          }
          review {
            reviewRating {
              ratingValue
              bestRating
            }
            author {
              name
            }
          }
          aggregateRating {
            ratingValue
            reviewCount
          }
          isVariantOf {
            hasVariant {
              name
              productID
              slug
              sku
            }
            productGroupID
            name
            additionalProperty {
              value
              name
            }
          }
          additionalProperty {
            name
            value
          }
        }
        cursor
      }
    }
    facets {
      key
      label
      type
      values {
        value
        label
        selected
        quantity
      }
    }
  }
}`
