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

export const byLinkIdCategoryDesksFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/category/by-linkid/desks',
  init: undefined,
  options: undefined,
  result: [
    {
      id: 9295,
      fatherCategoryId: 9282,
      name: 'Desks',
      linkId: 'desks',
      title: 'Desks',
      description: null,
      metaTagDescription: 'Desks for better productivity',
      availableLinkIds: null,
    },
  ],
}
