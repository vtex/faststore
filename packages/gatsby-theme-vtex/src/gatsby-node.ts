import { createHash } from 'crypto'
import { join, resolve } from 'path'

import { BabelGQLWebpackPlugin } from 'babel-gql/plugin'
import { ensureDir, outputFile, outputJSONSync, readJSONSync } from 'fs-extra'
import {
  CreatePagesArgs,
  CreateWebpackConfigArgs,
  ParentSpanPluginArgs,
  CreateBabelConfigArgs,
} from 'gatsby'
import { parse, print } from 'graphql'

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
    path: '/__client-side__/p',
    matchPath: '/:slug/p',
    component: resolve(__dirname, './src/templates/product.tsx'),
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

const getIsolatedQuery = (query: string, fieldName: string) => {
  const document = parse(query)

  const updatedRoot = (document
    .definitions[0] as any).selectionSet.selections.find(
    (selection: any) =>
      selection.name &&
      selection.name.kind === 'Name' &&
      selection.name.value === fieldName
  )

  if (!updatedRoot) {
    return null
  }

  ;(document.definitions[0] as any).selectionSet.selections =
    updatedRoot.selectionSet.selections

  return print(document)
}

const sha256 = (data: string) => createHash('sha256').update(data).digest('hex')

const updateStorageSync = (key: string, value: string, filepath: string) => {
  const data = readJSONSync(filepath)

  data[key] = value

  outputJSONSync(filepath, data)
}

export const onPreExtractQueries = ({ store }: ParentSpanPluginArgs) => {
  const filepath = join(root, 'public/persisted.graphql.json')

  outputJSONSync(filepath, {})

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

    const processedQuery = getIsolatedQuery(query, 'vtex')

    if (!processedQuery) {
      return
    }

    const hash = sha256(processedQuery)

    updateStorageSync(hash, processedQuery, filepath)

    pages.forEach((pagePath: string) => {
      const page = allPages.get(pagePath)

      page.context = { ...page.context, pageQuery: processedQuery }
    })
  })
}

export const onCreateBabelConfig = ({
  actions: { setBabelPlugin },
}: CreateBabelConfigArgs) => {
  setBabelPlugin({
    name: require.resolve('babel-gql/plugin'),
    options: {},
  })
}

export const onCreateWebpackConfig = ({
  actions: { setWebpackConfig },
}: CreateWebpackConfigArgs) => {
  // Clean global variables, otherwise 'babel-gql' complains
  if ((global as any)?.babelGQLQueryManager) {
    delete (global as any).babelGQLQueryManager
  }

  setWebpackConfig({
    plugins: [
      new BabelGQLWebpackPlugin({
        // the directory where persisted query files will be written to
        target: join(root, 'public/queries'),
      }),
    ],
  })
}
