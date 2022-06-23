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

export const catalogBrandListFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/brand/list',
  init: undefined,
  result: JSON.parse(
    `[{"id":9280,"name":"Brand","isActive":true,"title":"Brand","metaTagDescription":"Brand","imageUrl":null},{"id":2000001,"name":"Skechers","isActive":true,"title":"Skechers","metaTagDescription":"Sport, casual, work, wide, kids' & performance shoes with style, comfort, innovation, quality & value.","imageUrl":"/155421/skechers.jpg"},{"id":2000002,"name":"Acer","isActive":true,"title":"Acer","metaTagDescription":"Acer laptops, desktops as well as servers and storage, personal digital assistance (PDA), peripherals, peripherals and e-business services for government, business, education, and home users.","imageUrl":null},{"id":2000003,"name":"iRobot","isActive":true,"title":"iRobot","metaTagDescription":"iRobot, the leading global consumer robot company, designs and builds robots that empower people to do more both inside and outside of the home.","imageUrl":null},{"id":2000004,"name":"adidas","isActive":true,"title":"adidas","metaTagDescription":"adidas shoes, clothing and view new collections for adidas Originals, running, football, soccer, training and much more.","imageUrl":null},{"id":2000005,"name":"BLACK+DECKER","isActive":true,"title":"BLACK+DECKER","metaTagDescription":"Stanley Black & Decker, Inc. is a global provider of hand tools, power tools and related accessories, mechanical access solutions, such as automatic doors and commercial locking systems, electronic security and monitoring systems, healthcare solutions, engineered fastening systems, and products and services for various industrial applciations.","imageUrl":null},{"id":2000006,"name":"Nike","isActive":true,"title":"Nike","metaTagDescription":"Nike designs, develops, and sells a variety of products to help in playing basketball and soccer (football), as well as in running, men's and women's training, and other action sports.","imageUrl":null},{"id":2000007,"name":"Sany","isActive":false,"title":"Sany","metaTagDescription":"Camera, Photo","imageUrl":null},{"id":2000008,"name":"Nykor","isActive":false,"title":"Nykor","metaTagDescription":"Camera, Photo","imageUrl":null},{"id":2000009,"name":"Canyon","isActive":false,"title":"Canyon","metaTagDescription":"Camera, Photo","imageUrl":null},{"id":2000010,"name":"Loyka","isActive":false,"title":"Loyka","metaTagDescription":"Camera, Photo","imageUrl":null},{"id":2000011,"name":"Kodak","isActive":false,"title":"Kodak","metaTagDescription":"Camera, Photo","imageUrl":null},{"id":2000012,"name":"Appel","isActive":false,"title":"Appel","metaTagDescription":"Computer, Notebook","imageUrl":null},{"id":2000013,"name":"Azer","isActive":false,"title":"Azer","metaTagDescription":"","imageUrl":null},{"id":2000014,"name":"Semsung","isActive":false,"title":"Semsung","metaTagDescription":"Mobile, Cellphone","imageUrl":null},{"id":2000015,"name":"Vauve","isActive":false,"title":"Vauve","metaTagDescription":"Video game, PC","imageUrl":null},{"id":2000016,"name":"Nentendo","isActive":false,"title":"Nentendo","metaTagDescription":"Video game, PC","imageUrl":null},{"id":2000017,"name":"Macrosoft","isActive":false,"title":"Macrosoft","metaTagDescription":"Video game, PC","imageUrl":null},{"id":2000018,"name":"Mottarola","isActive":false,"title":"Mottarola","metaTagDescription":"Mobile, Cellphone","imageUrl":null},{"id":2000019,"name":"Robot","isActive":false,"title":"Robot","metaTagDescription":"Meta tags, Robot","imageUrl":null},{"id":2000020,"name":"Lemovo","isActive":false,"title":"Lemovo","metaTagDescription":"Lemovo, PC","imageUrl":null},{"id":2000021,"name":"Dill","isActive":false,"title":"Dill","metaTagDescription":"Dell, Notebook","imageUrl":null},{"id":2000022,"name":"LB","isActive":false,"title":"LB","metaTagDescription":"Mobile, Cellphone","imageUrl":null},{"id":2000023,"name":"Fillips","isActive":false,"title":"Fillips","metaTagDescription":"TV, Television","imageUrl":null},{"id":2000024,"name":"Filco","isActive":false,"title":"Filco","metaTagDescription":"TV, Television","imageUrl":null},{"id":2000025,"name":"GBL","isActive":false,"title":"GBL","metaTagDescription":"TV, Television","imageUrl":null},{"id":2000026,"name":"Superlaser","isActive":false,"title":"Superlaser","metaTagDescription":"Superlaser, Audio","imageUrl":null},{"id":2000027,"name":"Beets","isActive":false,"title":"Beets","metaTagDescription":"Beets, Audio","imageUrl":null},{"id":2000028,"name":"Xaomi","isActive":false,"title":"Xaomi","metaTagDescription":"Xaomi, Mobile","imageUrl":null},{"id":2000029,"name":"Garman","isActive":false,"title":"Garman","metaTagDescription":"Garman, Mobile","imageUrl":null},{"id":2000030,"name":"PT-Link","isActive":false,"title":"PT-Link","metaTagDescription":"Router, Internet","imageUrl":null},{"id":2000031,"name":"Logitecho","isActive":false,"title":"Logitecho","metaTagDescription":"Logitecho, Camera","imageUrl":null},{"id":2000032,"name":"Air","isActive":false,"title":"Air","metaTagDescription":"Air, Audio","imageUrl":null},{"id":2000033,"name":"Blekin","isActive":false,"title":"Blekin","metaTagDescription":"Blekin, Audio","imageUrl":null},{"id":2000034,"name":"Incaser","isActive":false,"title":"Incaser","metaTagDescription":"Incaser, Audio","imageUrl":null}]`
  ),
}

export const catalogCategory3Fetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/3',
  init: undefined,
  result: JSON.parse(
    '[{"id":9282,"name":"Office","hasChildren":true,"url":"http://storeframework.vtexcommercestable.com.br/office","children":[{"id":9295,"name":"Desks","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/office/desks","children":[],"Title":"Desks","MetaTagDescription":"Desks for better productivity"},{"id":9296,"name":"Chairs","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/office/chairs","children":[],"Title":"Chairs","MetaTagDescription":"Comfort chairs"}],"Title":"Office","MetaTagDescription":"For the office and home office"},{"id":9285,"name":"Kitchen and Home Appliances","hasChildren":true,"url":"http://storeframework.vtexcommercestable.com.br/kitchen-and-home-appliances","children":[{"id":9293,"name":"Fridges","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/kitchen-and-home-appliances/fridges","children":[],"Title":"Fridges","MetaTagDescription":"Fridges for the penguin"},{"id":9294,"name":"Appliances","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/kitchen-and-home-appliances/appliances","children":[],"Title":"Appliances","MetaTagDescription":"Appliances for you"}],"Title":"Home Appliances","MetaTagDescription":"Stay home with style"},{"id":9286,"name":"Computer and Software","hasChildren":true,"url":"http://storeframework.vtexcommercestable.com.br/computer-and-software","children":[{"id":9291,"name":"Smartphones","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/computer-and-software/smartphones","children":[],"Title":"Smartphones","MetaTagDescription":"You know what it is"},{"id":9292,"name":"Gadgets","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/computer-and-software/gadgets","children":[],"Title":"Gadgets","MetaTagDescription":"Gadgets for you"}],"Title":"Computer and Software","MetaTagDescription":"Get in touch with tomorrows world today"},{"id":9297,"name":"Technology","hasChildren":false,"url":"http://storeframework.vtexcommercestable.com.br/technology","children":[],"Title":"Technology","MetaTagDescription":"Technology"}]'
  ),
}

export const catalogPageTypeSkechers = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/skechers',
  init: undefined,
  result: JSON.parse(
    `{"id":"2000001","name":"Skechers","url":"storeframework.vtexcommercestable.com.br/Skechers","title":"Skechers","metaTagDescription":"Sport, casual, work, wide, kids' & performance shoes with style, comfort, innovation, quality & value.","pageType":"Brand"}`
  ),
}

export const catalogPageTypeAdidas = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/adidas',
  init: undefined,
  result: JSON.parse(
    `{"id":"2000004","name":"adidas","url":"storeframework.vtexcommercestable.com.br/adidas","title":"adidas","metaTagDescription":"adidas shoes, clothing and view new collections for adidas Originals, running, football, soccer, training and much more.","pageType":"Brand"}`
  ),
}

export const catalogPageTypeAcer = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/acer',
  init: undefined,
  result: JSON.parse(
    `{"id":"2000002","name":"Acer","url":"storeframework.vtexcommercestable.com.br/Acer","title":"Acer","metaTagDescription":"Acer laptops, desktops as well as servers and storage, personal digital assistance (PDA), peripherals, peripherals and e-business services for government, business, education, and home users.","pageType":"Brand"}`
  ),
}

export const catalogPageTypeIRobot = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/irobot',
  init: undefined,
  result: JSON.parse(
    `{"id":"2000003","name":"iRobot","url":"storeframework.vtexcommercestable.com.br/iRobot","title":"iRobot","metaTagDescription":"iRobot, the leading global consumer robot company, designs and builds robots that empower people to do more both inside and outside of the home.","pageType":"Brand"}`
  ),
}

export const catalogPageTypeBrand = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/catalog_system/pub/portal/pagetype/brand',
  init: undefined,
  result: JSON.parse(
    `{"id":"9280","name":"Brand","url":"storeframework.vtexcommercestable.com.br/Brand","title":"Brand","metaTagDescription":"Brand","pageType":"Brand"}`
  ),
}
