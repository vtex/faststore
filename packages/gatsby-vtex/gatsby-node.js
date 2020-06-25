require('dotenv').config({
  path: '.vtex-config',
})

const path = require('path')
const { join } = require('path')
const { ensureDir, outputFile } = require('fs-extra')

exports.createPages = async ({
  actions: { createPage, createRedirect },
  graphql,
}) => {
  createRedirect({
    fromPath: '/api/*',
    toPath: `https://${process.env.GATSBY_VTEX_TENANT}.${process.env.GATSBY_VTEX_ENVIRONMENT}.com.br/api/:splat`,
    statusCode: 200,
  })

  const { data, errors } = await graphql(`
    query {
      allProduct {
        nodes {
          id
          slug
        }
      }
      allCmsPage {
        nodes {
          name
          slug
          src
        }
      }
      allCategory {
        nodes {
          id
          slug
          categoryId
        }
      }
    }
  `)

  if (errors) {
    console.log(errors)
    return
  }

  const { allProduct, allCmsPage, allCategory } = data

  // Product Pages

  // Pre generated product pages
  allProduct.nodes.forEach((product) => {
    createPage({
      path: product.slug,
      component: path.resolve(`./src/templates/product/server.tsx`),
      context: {
        id: product.id,
      },
    })
  })

  // Client-side rendered product pages
  createPage({
    path: '/:slug/p',
    matchPath: '/:slug/p',
    component: path.resolve(`./src/templates/product/client.tsx`),
  })

  // CMS Pages

  // ensure dist folder
  const root = join(__dirname, '.cache/vtex-cms')
  await ensureDir(root)

  // Create page .tsx files as well as gatsby's node pages
  const cmsPages = allCmsPage.nodes.map(async (page) => {
    const { src, slug, name } = page
    const filepath = join(root, `${name}.tsx`)
    await outputFile(filepath, src)

    createPage({
      path: slug,
      component: filepath,
    })
  })
  await Promise.all(cmsPages)

  // Category Pages

  allCategory.nodes.forEach((category) => {
    createPage({
      path: category.slug,
      component: path.resolve(`./src/templates/category.tsx`),
      context: {
        id: category.id,
      },
    })
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
