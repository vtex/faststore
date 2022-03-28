export const ProductByIdQuery = `query ProductQuery {
  product(locator: [{key: "id", value: "64953394"}, {key: "channel", value: "1"}]) {
    slug
    name
    productID
    description
    sku
    gtin
    seo {
      title
      titleTemplate
      description
      canonical
    }
    breadcrumbList {
      itemListElement {
        item
        name
        position
      }
    }
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
        slug
        productID
      }
    }
    additionalProperty {
      value
      name
    }
  }
}
`
