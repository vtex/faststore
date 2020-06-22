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
      component: path.resolve(`./src/templates/product.tsx`),
      context: {
        id: product.id,
      },
    })
  })
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path !== '/') {
    return
  }

  page.matchPath = '/*'
  createPage(page)
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
