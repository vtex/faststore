import { join, resolve } from 'path'

import { ensureDir, outputFile } from 'fs-extra'
import { CreatePagesArgs, CreateWebpackConfigArgs } from 'gatsby'

//@ts-ignore
// import ModuleReplaceWebpackPlugin from 'module-replace-webpack-plugin'

import { Environment, Options } from './gatsby-config'

const root = process.cwd()

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
  { actions: { createPage, createRedirect }, graphql }: CreatePagesArgs,
  { getStaticPaths }: Options
) => {
  createRedirect({
    fromPath: '/api/*',
    toPath: `https://${tenant}.${environment}.com.br/api/:splat`,
    statusCode: 200,
  })

  createRedirect({
    fromPath: '/graphql/*',
    toPath: `https://${workspace}--${tenant}.myvtex.com/graphql/:splat`,
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
      createPage({
        path,
        component: resolve(__dirname, './src/templates/search.tsx'),
        context: {
          query: splitted.slice(1, splitted.length).join('/'),
          map: new Array(splitted.length - 1).fill('c').join(','),
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

  /**
   * CMS PAGES
   */

  const { data: cmsPageData, errors: cmsPageError } = await graphql<any>(`
    query {
      allCmsPage {
        nodes {
          name
          slug
          src
        }
      }
    }
  `)

  if (cmsPageError) {
    console.error(cmsPageError)

    return
  }

  const { allCmsPage } = cmsPageData

  // ensure dist folder
  const cmsRoot = join(root, '.cache/vtex-cms')

  await ensureDir(cmsRoot)

  // Create page .tsx files as well as gatsby's node pages
  const cmsPages = allCmsPage.nodes.map(async (page: any) => {
    const { src, slug, name } = page
    const filepath = join(cmsRoot, `${name}.tsx`)

    await outputFile(filepath, src)
    createPage({
      path: slug,
      component: filepath,
      context: {},
    })
  })

  await Promise.all(cmsPages)
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
