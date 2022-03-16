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

export const CollectionDesksResponse = {
  data: {
    collection: {
      id: '9295',
      slug: 'Office/Desks',
      type: 'Category',
      seo: {
        title: 'Desks',
        titleTemplate: '',
        description: 'Desks for better productivity',
        canonical: '',
      },
      breadcrumbList: {
        itemListElement: [
          {
            item: '/office',
            name: 'Office',
            position: 1,
          },
          {
            item: '/office/desks',
            name: 'Desks',
            position: 2,
          },
        ],
        numberOfItems: 2,
      },
      meta: {
        selectedFacets: [
          {
            key: 'category-1',
            value: 'office',
          },
          {
            key: 'category-2',
            value: 'desks',
          },
        ],
      },
    },
  },
}
