export const CollectionDesksQuery = `query CollectionQuery {
  collection(slug: "desks") {
    id
    slug
    type
    seo {
      title
      titleTemplate
      description
      canonical
    }
    breadcrumbList{
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
  }
}
`
