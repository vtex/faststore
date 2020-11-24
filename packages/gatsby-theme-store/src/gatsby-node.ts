import { resolve } from 'path'

import { CreatePagesArgs, CreateWebpackConfigArgs } from 'gatsby'

import { Environment, Options } from './gatsby-config'

const tenant = process.env.GATSBY_VTEX_TENANT as string
const environment = process.env.GATSBY_VTEX_ENVIRONMENT as Environment
const workspace = process.env.GATSBY_VTEX_IO_WORKSPACE as string

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
  { actions: { createPage, createRedirect } }: CreatePagesArgs,
  { getStaticPaths }: Options
) => {
  createRedirect({
    fromPath: '/api/io/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/api/*',
    toPath: `https://${tenant}.${environment}.com.br/api/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/checkout/*',
    toPath: `https://${tenant}.${environment}.com.br/checkout/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/graphql/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/graphql/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/sitemap.xml',
    toPath: `https://${workspace}--${tenant}.myvtex.com/sitemap.xml`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/sitemap/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/sitemap/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/XMLData/*',
    toPath: `https://${tenant}.${environment}.com.br/XMLData/:splat`,
    statusCode: 200,
    headers: {
      // VTEX ID needs the forwarded host in order to set the cookie correctly
      'x-forwarded-host': '$host',
    },
  })

  createRedirect({
    fromPath: '/arquivos/*',
    toPath: `https://${tenant}.vtexassets.com/arquivos/:splat`,
    statusCode: 200,
  })

  createRedirect({
    fromPath: '/files/*',
    toPath: `https://${tenant}.vtexassets.com/files/:splat`,
    statusCode: 200,
  })

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
