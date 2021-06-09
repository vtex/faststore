const { resolve, relative } = require('path')

exports.onPostBootstrap = (_, { storeId }) => {
  process.env.GATSBY_STORE_ID = storeId
}

exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    storeId: Joi.string().required(),
    locales: Joi.array().items(Joi.string()).required(),
    defaultLocale: Joi.string().required(),
    profiling: Joi.boolean(),
  })

exports.createPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  /**
   * STATIC PATHS
   */

  const { data: staticPaths, errors } = await graphql(`
    query GetAllStaticPaths {
      searches: allStaticPath(
        filter: {
          pageType: { in: ["Department", "Category", "Brand", "SubCategory"] }
        }
      ) {
        nodes {
          ...staticPath
        }
      }
      products: allStaticPath(filter: { pageType: { eq: "Product" } }) {
        nodes {
          ...staticPath
        }
      }
    }

    fragment staticPath on StaticPath {
      id
      path
      pageType
    }
  `)

  if (errors && errors.length > 0) {
    reporter.panicOnBuild(
      `[gatsby-theme-store]: Something went wrong while querying for static paths: ${errors.toString()}`
    )

    return
  }

  const {
    searches: { nodes: searches = [] },
    products: { nodes: products = [] },
  } = staticPaths

  /**
   * Create search static paths
   */
  for (const search of searches) {
    const { path, id, pageType } = search
    const [, ...segments] = path.split('/')
    const key = pageType === 'Brand' ? 'b' : 'c'

    const searchParams = {
      orderBy: '',
      selectedFacets: segments.map((segment) => ({
        key,
        value: segment,
      })),
    }

    createPage({
      path,
      component: resolve(__dirname, 'src/templates/search.server.tsx'),
      context: {
        ...searchParams,
        id,
        canonicalPath: path,
      },
    })

    createPage({
      path: `${path}/__client_side_search__`,
      matchPath: `${path}/*`,
      component: resolve(__dirname, 'src/templates/search.browser.tsx'),
      context: {
        id,
        canonicalPath: path,
      },
    })
  }

  /**
   * Create product static paths
   */
  for (const product of products) {
    const { path } = product
    const [, slug] = path.split('/')

    createPage({
      path,
      component: resolve(__dirname, 'src/templates/product.server.tsx'),
      context: { slug },
    })
  }

  /**
   * CLIENT ONLY PATHS
   */

  // Client-side rendered product pages
  createPage({
    path: '/__client_side_product__/p',
    matchPath: '/:slug/p',
    component: resolve(__dirname, 'src/templates/product.browser.tsx'),
    context: {},
  })

  // Client side, full text, search page
  createPage({
    path: '/s/__client_side_search__',
    matchPath: '/s/*',
    component: resolve(__dirname, 'src/templates/search.browser.tsx'),
    context: {},
  })
}

const resolveToTS = (pkg, file) => {
  const root = `${process.cwd()}/.cache`

  let cjs = require.resolve(`${pkg}/${file}.js`, { paths: [process.cwd()] })

  if (file === 'gatsby-browser') {
    cjs = relative(root, cjs)
  }

  const ts = cjs.replace(`/${file}.js`, `/src/${file}`)

  return {
    [cjs]: ts,
  }
}

exports.onCreateWebpackConfig = (
  { actions: { setWebpackConfig }, stage },
  { profiling = false }
) => {
  const profilingConfig =
    stage === 'build-javascript' && profiling === true
      ? {
          resolve: {
            alias: {
              'react-dom': 'react-dom/profiling',
              'scheduler/tracing': 'scheduler/tracing-profiling',
            },
          },
          optimization: {
            minimize: false,
            moduleIds: 'named',
            chunkIds: 'named',
            concatenateModules: false,
          },
        }
      : null

  setWebpackConfig({
    ...profilingConfig,
    resolve: {
      alias: {
        ...profilingConfig?.resolve.alias,
        // Gatsby-plugin-next-seo does not have a "sideEffects: false" in its package.json. Webpack doesn't know if
        // it can tree shake it or not. This points the webpack directly to the source file so everything is imported
        // using es6 and only the used packages are used
        'gatsby-plugin-next-seo$': resolve(
          require.resolve('gatsby-plugin-next-seo', { paths: [process.cwd()] }),
          stage === 'build-javascript' || stage === 'develop'
            ? '../../src/index'
            : ''
        ),
        '@vtex/store-ui$': resolve(
          require.resolve('@vtex/store-ui', { paths: [process.cwd()] }),
          stage === 'build-javascript' || stage === 'develop'
            ? '../../src/index'
            : ''
        ),
        // Resolve to the .ts versions of gatsby-(browser|ssr) so we don't end up by adding the whole lib.
        ...resolveToTS('gatsby-plugin-next-seo', 'gatsby-browser'),
        ...resolveToTS('gatsby-plugin-next-seo', 'gatsby-ssr'),
        '@vtex/order-manager': require.resolve(
          '@vtex/order-manager/src/index.tsx'
        ),
        '@vtex/order-items': require.resolve('@vtex/order-items/src/index.tsx'),
      },
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            { loader: require.resolve('html-loader') },
            { loader: require.resolve('markdown-loader') },
          ],
        },
      ],
    },
  })
}
