import path from 'path'

import { CreateWebpackConfigArgs, GatsbyNode } from 'gatsby'

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

export const onCreateWebpackConfig = ({
  actions: { setWebpackConfig },
}: CreateWebpackConfigArgs) => {
  setWebpackConfig({
    resolve: {
      alias: {
        react: require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        '@loadable/component': require.resolve('@loadable/component'),
        '@loadable/server': require.resolve('@loadable/server'),
      },
    },
  })
}
