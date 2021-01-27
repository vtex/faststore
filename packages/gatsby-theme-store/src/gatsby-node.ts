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
  getStaticPaths?: () => Promise<string[]>
  locales: string[]
  defaultLocale: string
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    storeId: Joi.string().required(),
    locales: Joi.array().items(Joi.string()).required(),
    defaultLocale: Joi.string().required(),
    getStaticPaths: Joi.function().arity(0).required(),
  })

const getRoute = (segments: string[]) => {
  if (segments.length === 1 && segments[0] === '') {
    return null
  }

  if (segments.length === 2 && segments[segments.length - 1] === 'p') {
    return 'product'
  }

  if (segments.length >= 1) {
    return 'search'
  }

  throw new Error(`Unroutable route: /${segments.join('/')}`)
}

const normalizePath = (path: string) => {
  const i = path[0] === '/' ? 1 : 0
  const j = path[path.length - 1] === '/' ? path.length - 1 : path.length

  return `/${path.slice(i, j)}`
}

export const createPages = async (
  { actions: { createPage, createRedirect } }: CreatePagesArgs,
  { getStaticPaths }: Options
) => {
  /**
   * STATIC PATHS
   */

  const staticPaths =
    typeof getStaticPaths === 'function' ? await getStaticPaths() : []

  staticPaths.map(normalizePath).map(async (path) => {
    const [, ...segments] = path.split('/')
    const route = getRoute(segments)

    // Product Pages
    if (route === 'product') {
      const [slug] = segments

      createPage({
        path,
        component: resolve(__dirname, './src/templates/product.tsx'),
        context: {
          slug,
          staticPath: true,
        },
      })
    }

    // Search Pages
    else if (route === 'search') {
      const searchParams = {
        orderBy: '',
        query: segments.join('/'),
        map: new Array(segments.length).fill('c').join(','),
        selectedFacets: segments.map((segment) => ({
          key: 'c',
          value: segment,
        })),
      }

      createPage({
        path,
        component: resolve(__dirname, './src/templates/search.tsx'),
        context: {
          ...searchParams,
          canonicalPath: path,
          staticPath: true,
        },
      })

      createPage({
        path: `${path}/__client_side_search__`,
        matchPath: `${path}/*`,
        component: resolve(__dirname, './src/templates/search.tsx'),
        context: {
          canonicalPath: path,
          staticPath: false,
        },
      })
    }
  })

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
    path: '/__client_side_search__',
    matchPath: '/*',
    component: resolve(__dirname, './src/templates/search.tsx'),
    context: {
      staticPath: false,
    },
  })

  // I couldn't find a better way to make the path /404 return status code 404
  // in Netlify, so the work around I found was to create a page and than create
  // a redirect to it returning 404 status code

  createPage({
    path: '/404/__not_found__',
    matchPath: '/404/*',
    component: resolve(__dirname, './src/templates/404.tsx'),
    context: {},
  })

  createRedirect({
    fromPath: '/404',
    toPath: '/404/__not_found__',
    statusCode: 404,
  })
}

export const onCreateWebpackConfig = ({
  actions: { setWebpackConfig },
}: CreateWebpackConfigArgs) => {
  setWebpackConfig({
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
