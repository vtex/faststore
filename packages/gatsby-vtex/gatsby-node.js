const path = require('path')

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const { data } = await graphql(`
    query {
      allProduct {
        nodes {
          id
          slug
        }
      }
    }
  `)

  data.allProduct.nodes.forEach((product) => {
    createPage({
      path: product.slug,
      component: path.resolve(`./src/templates/product/server.tsx`),
      context: {
        id: product.id,
      },
    })
  })

  createPage({
    path: '/:slug/p',
    matchPath: '/:slug/p',
    component: path.resolve(`./src/templates/product/client.tsx`),
  })
}

exports.onCreateWebpackConfig = ({ actions: { setWebpackConfig } }) => {
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
