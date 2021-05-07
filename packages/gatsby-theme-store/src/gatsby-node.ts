import { resolve, relative } from 'path'

import type {
  CreatePagesArgs,
  CreateWebpackConfigArgs,
  PluginOptionsSchemaArgs,
  ParentSpanPluginArgs,
} from 'gatsby'

export const onPostBootstrap = (
  _: ParentSpanPluginArgs,
  { storeId }: Options
) => {
  process.env.GATSBY_STORE_ID = storeId
}

export interface Options {
  storeId: string
  locales: string[]
  defaultLocale: string
  profiling?: boolean
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    storeId: Joi.string().required(),
    locales: Joi.array().items(Joi.string()).required(),
    defaultLocale: Joi.string().required(),
    profiling: Joi.boolean(),
  })

interface StaticPath {
  id: string
  path: string
  pageType:
    | 'Product'
    | 'Department'
    | 'Category'
    | 'Brand'
    | 'FullText'
    | 'NotFound'
}

export const createPages = async ({
  actions: { createPage, createRedirect },
  graphql,
  reporter,
}: CreatePagesArgs) => {
  /**
   * STATIC PATHS
   */

  const { data: staticPaths, errors } = await graphql<{
    searches: { nodes: StaticPath[] }
    products: { nodes: StaticPath[] }
  }>(`
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
  } = staticPaths!

  /**
   * Create search static paths
   */
  for (const search of searches) {
    const { path, id, pageType } = search
    const [, ...segments] = path.split('/')
    const key = pageType === 'Brand' ? 'b' : 'c'

    const searchParams = {
      orderBy: '',
      query: segments.join('/'),
      map: new Array(segments.length).fill(key).join(','),
      selectedFacets: segments.map((segment) => ({
        key,
        value: segment,
      })),
    }

    createPage({
      path,
      component: resolve(__dirname, './src/templates/search.tsx'),
      context: {
        ...searchParams,
        id,
        canonicalPath: path,
        staticPath: true,
      },
    })

    createRedirect({
      fromPath: `${path}/`,
      toPath: path,
      isPermanent: true,
      statusCode: 301,
      redirectInBrowser: false,
    })

    createPage({
      path: `${path}/__client_side_search__`,
      matchPath: `${path}/*`,
      component: resolve(__dirname, './src/templates/search.tsx'),
      context: {
        id,
        canonicalPath: path,
        staticPath: false,
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
      component: resolve(__dirname, './src/templates/product.tsx'),
      context: {
        slug,
        staticPath: true,
      },
    })
  }

  /**
   * CLIENT ONLY PATHS
   */

  // Client-side rendered product pages
  createPage({
    path: '/__client_side_product__/p',
    matchPath: '/:slug/p',
    component: resolve(__dirname, './src/templates/product.tsx'),
    context: {
      staticPath: false,
    },
  })

  // Client side search page
  createPage({
    path: '/s/__client_side_search__',
    matchPath: '/s/*',
    component: resolve(__dirname, './src/templates/search.tsx'),
    context: {
      staticPath: false,
    },
  })
}

const resolveToTS = (
  pkg: string,
  file: 'gatsby-browser' | 'gatsby-ssr' | 'gatsby-node'
): Record<string, string> => {
  const root = `${process.cwd()}/.cache`
  const cjs = relative(root, require.resolve(`${pkg}/${file}.js`))
  const ts = cjs.replace(`/${file}.js`, `/src/${file}`)

  return {
    [cjs]: ts,
  }
}

export const onCreateWebpackConfig = (
  { actions: { setWebpackConfig }, stage }: CreateWebpackConfigArgs,
  { profiling = false }: Options
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
          require.resolve('gatsby-plugin-next-seo'),
          stage === 'build-javascript' || stage === 'develop'
            ? '../../src/index'
            : ''
        ),
        '@vtex/store-ui$': resolve(
          require.resolve('@vtex/store-ui'),
          stage === 'build-javascript' || stage === 'develop'
            ? '../../src/index'
            : ''
        ),
        // Resolve to the .ts versions of gatsby-(browser|ssr) so we don't end up by adding the whole lib.
        ...resolveToTS('gatsby-plugin-next-seo', 'gatsby-browser'),
        ...resolveToTS('gatsby-plugin-next-seo', 'gatsby-ssr'),
        ...resolveToTS('@vtex/gatsby-theme-store', 'gatsby-browser'),
        ...resolveToTS('@vtex/gatsby-theme-store', 'gatsby-ssr'),
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
