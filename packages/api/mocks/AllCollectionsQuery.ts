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

export const AllCollectionsFirst5Response = {
  data: {
    allCollections: {
      edges: [
        {
          cursor: '0',
          node: {
            id: '9280',
            slug: 'brand',
            type: 'Brand',
            breadcrumbList: {
              itemListElement: [
                {
                  item: '/brand',
                  name: 'Brand',
                  position: 1,
                },
              ],
              numberOfItems: 1,
            },
            meta: {
              selectedFacets: [
                {
                  key: 'brand',
                  value: 'brand',
                },
              ],
            },
            seo: {
              canonical: '',
              description: 'Brand',
              title: 'Brand',
              titleTemplate: '',
            },
          },
        },
        {
          cursor: '1',
          node: {
            id: '2000001',
            slug: 'skechers',
            type: 'Brand',
            breadcrumbList: {
              itemListElement: [
                {
                  item: '/skechers',
                  name: 'Skechers',
                  position: 1,
                },
              ],
              numberOfItems: 1,
            },
            meta: {
              selectedFacets: [
                {
                  key: 'brand',
                  value: 'skechers',
                },
              ],
            },
            seo: {
              canonical: '',
              description:
                "Sport, casual, work, wide, kids' & performance shoes with style, comfort, innovation, quality & value.",
              title: 'Skechers',
              titleTemplate: '',
            },
          },
        },
        {
          cursor: '2',
          node: {
            id: '2000002',
            slug: 'acer',
            type: 'Brand',
            breadcrumbList: {
              itemListElement: [
                {
                  item: '/acer',
                  name: 'Acer',
                  position: 1,
                },
              ],
              numberOfItems: 1,
            },
            meta: {
              selectedFacets: [
                {
                  key: 'brand',
                  value: 'acer',
                },
              ],
            },
            seo: {
              canonical: '',
              description:
                'Acer laptops, desktops as well as servers and storage, personal digital assistance (PDA), peripherals, peripherals and e-business services for government, business, education, and home users.',
              title: 'Acer',
              titleTemplate: '',
            },
          },
        },
        {
          cursor: '3',
          node: {
            id: '2000003',
            slug: 'irobot',
            type: 'Brand',
            breadcrumbList: {
              itemListElement: [
                {
                  item: '/irobot',
                  name: 'iRobot',
                  position: 1,
                },
              ],
              numberOfItems: 1,
            },
            meta: {
              selectedFacets: [
                {
                  key: 'brand',
                  value: 'i-robot',
                },
              ],
            },
            seo: {
              canonical: '',
              description:
                'iRobot, the leading global consumer robot company, designs and builds robots that empower people to do more both inside and outside of the home.',
              title: 'iRobot',
              titleTemplate: '',
            },
          },
        },
        {
          cursor: '4',
          node: {
            id: '2000004',
            slug: 'adidas',
            type: 'Brand',
            breadcrumbList: {
              itemListElement: [
                {
                  item: '/adidas',
                  name: 'adidas',
                  position: 1,
                },
              ],
              numberOfItems: 1,
            },
            meta: {
              selectedFacets: [
                {
                  key: 'brand',
                  value: 'adidas',
                },
              ],
            },
            seo: {
              canonical: '',
              description:
                'adidas shoes, clothing and view new collections for adidas Originals, running, football, soccer, training and much more.',
              title: 'adidas',
              titleTemplate: '',
            },
          },
        },
      ],
      pageInfo: {
        endCursor: '4',
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: '0',
        totalCount: 17,
      },
    },
  },
}
