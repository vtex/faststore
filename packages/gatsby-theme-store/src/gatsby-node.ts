import { resolve } from 'path'

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
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    storeId: Joi.string().required(),
    locales: Joi.array().items(Joi.string()).required(),
    defaultLocale: Joi.string().required(),
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
        filter: { pageType: { in: ["Department", "Category", "Brand"] } }
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

export const onCreateWebpackConfig = ({
  actions: { setWebpackConfig },
  stage,
}: CreateWebpackConfigArgs) => {
  const enableProfiling = process.env.GATSBY_STORE_PROFILING === 'true'

  const profilingConfig =
    stage === 'build-javascript' && enableProfiling === true
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
