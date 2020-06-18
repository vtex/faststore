import path from 'path'

import { GatsbyNode } from 'gatsby'

export const createPages: GatsbyNode['createPages'] = async ({
  actions: { createPage },
  graphql,
}) => {
  const { data }: any = await graphql(`
    query {
      allProduct {
        nodes {
          id
          slug
        }
      }
    }
  `)

  data.allProduct.nodes.forEach((product: any) => {
    createPage({
      path: product.slug,
      component: path.resolve(`./src/templates/product.tsx`),
      context: {
        id: product.id,
      },
    })
  })
}

export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
}) => {
  const { createPage } = actions

  if (page.path !== '/') {
    return
  }

  page.matchPath = '/*'
  createPage(page)
}
