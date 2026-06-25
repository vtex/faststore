import { expect } from 'vitest'

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

export const catalogCategory10Fetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/10',
  init: undefined,
  options: { storeCookies: expect.any(Function) },
  result: JSON.parse(
    '[{"id":9282,"name":"Office","hasChildren":true,"url":"http://storeframework.vtexcommercestable.com.br/office","children":[{"id":9295,"name":"Desks","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/office/desks","children":[],"Title":"Desks","MetaTagDescription":"Desks for better productivity"},{"id":9296,"name":"Chairs","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/office/chairs","children":[],"Title":"Chairs","MetaTagDescription":"Comfort chairs"}],"Title":"Office","MetaTagDescription":"For the office and home office"},{"id":9285,"name":"Kitchen and Home Appliances","hasChildren":true,"url":"http://storeframework.vtexcommercestable.com.br/kitchen-and-home-appliances","children":[{"id":9293,"name":"Fridges","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/kitchen-and-home-appliances/fridges","children":[],"Title":"Fridges","MetaTagDescription":"Fridges for the penguin"},{"id":9294,"name":"Appliances","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/kitchen-and-home-appliances/appliances","children":[],"Title":"Appliances","MetaTagDescription":"Appliances for you"}],"Title":"Home Appliances","MetaTagDescription":"Stay home with style"},{"id":9286,"name":"Computer and Software","hasChildren":true,"url":"http://storeframework.vtexcommercestable.com.br/computer-and-software","children":[{"id":9291,"name":"Smartphones","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/computer-and-software/smartphones","children":[],"Title":"Smartphones","MetaTagDescription":"You know what it is"},{"id":9292,"name":"Gadgets","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/computer-and-software/gadgets","children":[],"Title":"Gadgets","MetaTagDescription":"Gadgets for you"}],"Title":"Computer and Software","MetaTagDescription":"Get in touch with tomorrows world today"},{"id":9297,"name":"Technology","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/technology","children":[],"Title":"Technology","MetaTagDescription":"Technology"}]'
  ),
}
