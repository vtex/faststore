import { resolve } from 'path'

import {
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

export interface LocalizationThemeOptions {
  messagesPath?: string
  locales?: string[]
  defaultLocale?: string
}

export interface Options {
  storeId: string
  getStaticPaths?: () => Promise<string[]>
  localizationThemeOptions?: LocalizationThemeOptions
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    storeId: Joi.string().required(),
    localizationThemeOptions: Joi.object({
      messagesPath: Joi.string(),
      locales: Joi.array().items(Joi.string()),
      defaultLocale: Joi.string(),
    }),
    getStaticPaths: Joi.function().arity(0).required(),
  })

const getRoute = (path: string) => {
  const splitted = path.split('/')

  if (path === '/') {
    return null
  }

  if (splitted.length === 3 && path.endsWith('/p')) {
    return 'product'
  }

  if (splitted.length >= 2) {
    return 'search'
  }

  throw new Error(`Unroutable route: ${path}`)
}

export const createPages = async (
  { actions: { createPage } }: CreatePagesArgs,
  { getStaticPaths }: Options
) => {
  /**
   * STATIC PATHS
   */

  const staticPaths =
    typeof getStaticPaths === 'function' ? await getStaticPaths() : []

  staticPaths.map(async (path) => {
    const route = getRoute(path)
    const splitted = path.split('/')

    // Product Pages
    if (route === 'product') {
      const [, slug] = splitted

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
      const segments = splitted.filter((segment) => !!segment)

      createPage({
        path,
        component: resolve(__dirname, './src/templates/search.tsx'),
        context: {
          orderBy: '',
          query: segments.join('/'),
          map: new Array(segments.length).fill('c').join(','),
          selectedFacets: segments.map((segment) => ({
            key: 'c',
            value: segment,
          })),
          staticPath: true,
        },
      })
    }
  })

  /**
   * CLIENT ONLY PATHS
   */

  // Client-side rendered product pages
  createPage({
    path: '/__client-side-product__/p',
    matchPath: '/:slug/p',
    component: resolve(__dirname, './src/templates/product.tsx'),
    context: {
      staticPath: false,
    },
  })

  createPage({
    path: '/__client-side-search__',
    matchPath: '/*',
    component: resolve(__dirname, './src/templates/search.tsx'),
    context: {
      staticPath: false,
    },
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
