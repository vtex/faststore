const query = `
query Search($query: String, $map: String, $from: Int, $to: Int) {
  productSearch(query: $query, map: $map, from: $from, to: $to) {
    products {
      productId
      productName
      description
      linkText
      items {
        itemId
        images {
          imageUrl
          imageText
        }
        sellers {
          sellerId
          commertialOffer {
            AvailableQuantity
            Price
            ListPrice
          }
        }
      }
    }
    breadcrumb {
      href
      name
    }
    titleTag
  }
}
`

export default query
