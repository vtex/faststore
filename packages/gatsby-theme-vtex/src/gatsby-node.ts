import { join, resolve } from 'path'

import { ensureDir, outputFile } from 'fs-extra'
import { CreatePagesArgs, ParentSpanPluginArgs } from 'gatsby'

import { Environment, Options } from './gatsby-config'

const root = process.cwd()
const tenant = process.env.GATSBY_VTEX_TENANT ?? 'storecomponents'
const environment =
  (process.env.GATSBY_VTEX_ENVIRONMENT as Environment) ?? 'vtexcommercestable'

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
    toPath: `https://gimenes--${tenant}.myvtex.com/graphql/:splat`,
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
          withProduct: true,
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
        },
      })
    }
  })

  /**
   * CLIENT ONLY PATHS
   */

  // Client-side rendered product pages
  createPage({
    path: '/__client-side__/p',
    matchPath: '/:slug/p',
    component: resolve(__dirname, './src/templates/product.tsx'),
    context: {
      withProduct: false,
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

export const onPreExtractQueries = ({ store }: ParentSpanPluginArgs) => {
  store.subscribe(async () => {
    const {
      lastAction: { type, payload },
      components,
      pages: allPages,
    } = store.getState()

    if (type !== 'QUERY_EXTRACTED') {
      return
    }

    const { componentPath } = payload
    const { query, pages } = components.get(componentPath)

    if (!query) {
      return
    }

    pages.forEach((pagePath: string) => {
      const page = allPages.get(pagePath)

      page.context = { ...page.context, pageQuery: query }
    })
  })
}
