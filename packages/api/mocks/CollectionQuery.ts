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

export const pageTypeDesksFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/desks',
  init: undefined,
  result: JSON.parse(
    '{"id":"9295","name":"Desks","url":"storeframework.vtexcommercestable.com.br/Office/Desks","title":"Desks","metaTagDescription":"Desks for better productivity","pageType":"Category"}'
  ),
}

export const pageTypeOfficeFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/office',
  init: undefined,
  result: JSON.parse(
    '{"id":"9282","name":"Office","url":"storeframework.vtexcommercestable.com.br/Office","title":"Office","metaTagDescription":"For the office and home office","pageType":"Department"}'
  ),
}

export const pageTypeOfficeDesksFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/office/desks',
  init: undefined,
  result: JSON.parse(
    '{"id":"9295","name":"Desks","url":"storeframework.vtexcommercestable.com.br/Office/Desks","title":"Desks","metaTagDescription":"Desks for better productivity","pageType":"Category"}'
  ),
}
