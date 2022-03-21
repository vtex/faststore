export const AllCollectionsQueryFirst5 = `query allCollections {
  allCollections(first: 5) {
    edges {
      cursor
      node {
        id
        slug
        type
        breadcrumbList {
          itemListElement {
            item
            name
            position
          }
          numberOfItems
        }
        meta {
          selectedFacets {
            key
            value
          }
        }
        seo {
          canonical
          description
          title
          titleTemplate
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
      totalCount
    }
  }
}
`
