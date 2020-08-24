import { join, resolve } from 'path'

import { ensureDir, outputFile, readJSON, unlink } from 'fs-extra'
import { CreatePageArgs, CreatePagesArgs, CreateWebpackConfigArgs, SourceNodesArgs } from 'gatsby'
import { compile } from '@formatjs/cli'

import { Environment, Options } from './gatsby-config'

function isDefaultLang(locale: string, defaultLocale: string) {
  return locale === defaultLocale
}

function localizedPath(
  defaultLocale: string,
  locale: string,
  path: string
) {
  // The default language isn't prefixed
  if (isDefaultLang(locale, defaultLocale)) {
    return path
  }

  const [, base] = path.split(`/`)

  // If for whatever reason we receive an already localized path
  // (e.g. if the path was made with location.pathname)
  // just return it as-is.
  if (base === locale) {
    return path
  }

  // If it's another language, prefix with the locale
  return `/${locale}${path}`
}

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
    resolve: {
      alias: {
        'react-intl$': 'react-intl/react-intl-no-parser.umd',
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

export const sourceNodes = async (
  args: SourceNodesArgs,
  { localizationThemeOptions }: any
) => {
  console.log('teste sourceNodes!!!')
  const {
    actions: { createNode },
    createNodeId,
    createContentDigest,
    reporter,
  } = args

  const {
    messagesPath,
    locales,
    defaultLocale = 'en',
  } = localizationThemeOptions

  if (!locales.includes(defaultLocale)) {
    reporter.panicOnBuild(
      'Please provide a default locale that is contained in your provided locales array'
    )

    return
  }

  for (const locale of locales) {
    let languageJson = null as Record<string, string> | null

    try {
      languageJson = await readJSON(`${messagesPath}/${locale}.json`, {
        encoding: 'utf-8',
      })
    } catch (e) {
      languageJson = null
    }

    if (languageJson == null && locale === defaultLocale) {
      reporter.panicOnBuild(`Error reading strings for default locale`)

      return
    }

    if (languageJson == null) {
      reporter.info(`Error reading strings for locale ${locale}`)
      continue
    }

    const withDefaultMessage = Object.entries(languageJson).reduce(
      (acc, [key, val]) => {
        acc[key] = { defaultMessage: val }

        return acc
      },
      {} as Record<string, { defaultMessage: string }>
    )

    await outputFile(
      `${messagesPath}/${locale}-temp.json`,
      JSON.stringify(withDefaultMessage)
    )

    const resultAsString = await compile(
      [`${messagesPath}/${locale}-temp.json`],
      { ast: true }
    )

    await unlink(`${messagesPath}/${locale}-temp.json`)
    const data = { messages: resultAsString, locale }

    createNode({
      ...data,
      id: createNodeId(`LanguageData-${locale}`),
      internal: {
        type: 'LanguageData',
        content: JSON.stringify(data),
        contentDigest: createContentDigest(data),
      },
    })
  }

  const languageDataConfig = {
    locales,
    defaultLocale,
  }

  createNode({
    ...languageDataConfig,
    id: createNodeId(`LanguageDataConfig`),
    internal: {
      type: 'LanguageDataConfig',
      content: JSON.stringify(languageDataConfig),
      contentDigest: createContentDigest(languageDataConfig),
    },
  })
}

export const onCreatePage = async ({
  page,
  actions,
  getNodesByType,
}: CreatePageArgs) => {
  const { createPage, deletePage } = actions

  console.log('teste ON CREATE PAGE!')

  // Check if originalPath was already set and bail early as otherwise an infinite loop could occur
  // as other plugins like gatsby-plugin-mdx could modify this
  if (page.context.originalPath) {
    return
  }

  const originalPath = page.path

  deletePage(page)

  const languageNodes = getNodesByType('LanguageData') as any
  const languageConfig = getNodesByType(
    'LanguageDataConfig'
  )[0]

  const { defaultLocale } = languageConfig

  for (const languageData of languageNodes) {
    const { locale, messages } = languageData

    console.log('teste ON CREATE PAGE!: ', messages)
    createPage({
      ...page,
      path: localizedPath(defaultLocale as any, locale, page.path),
      matchPath: page.matchPath
        ? localizedPath(defaultLocale as any, locale, page.matchPath)
        : page.matchPath,
      context: {
        ...page.context,
        messages: JSON.parse(messages || ''),
        locale,
        defaultLocale,
        originalPath,
      },
    })
  }
}
