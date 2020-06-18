const path = require('path')

exports.createPages = async ({ page, graphql, actions }) => {
  const { createPage } = actions
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
  if (page.path === '/') {
    page.matchPath = '/*'
    createPage(page)
  }
}
