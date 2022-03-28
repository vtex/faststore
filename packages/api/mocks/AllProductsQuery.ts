export const AllProductsQueryFirst5 = `query AllProducts {
  allProducts(first: 5) {
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
      totalCount
    }
    edges {
      cursor
      node {
        description
        gtin
        image {
          alternateName
          url
        }
        isVariantOf {
          name
          productGroupID
          hasVariant {
            name
            sku
          }
        }
        name
        productID
        review {
          author {
            name
          }
          reviewRating {
            bestRating
            ratingValue
          }
        }
        seo {
          canonical
          description
          title
          titleTemplate
        }
        sku
        slug
        offers {
          highPrice
          lowPrice
          offerCount
          priceCurrency
          offers {
            availability
            itemCondition
            listPrice
            price
            priceCurrency
            quantity
            sellingPrice
            seller {
              identifier
            }
            itemOffered {
              name
              sku
            }
          }
        }
      }
    }
  }
}
`
