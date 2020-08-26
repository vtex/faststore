import {
  CreatePageArgs,
  CreateWebpackConfigArgs,
  Node,
  SourceNodesArgs,
} from 'gatsby'
import { readJSON, outputFile, unlink } from 'fs-extra'
import { compile } from '@formatjs/cli'

import { localizedPath } from './helpers'

interface LanguageDataNode extends Node {
  messages: string
  locale: string
}

interface LanguageConfigNode extends Node {
  defaultLocale: string
  locales: string[]
}

interface ThemeOptions {
  locales?: string[]
  defaultLocale?: string
  messagesPath?: string
}

const localesArrayDefault = ['en']

export const sourceNodes = async (
  args: SourceNodesArgs,
  options: ThemeOptions
) => {
  const {
    actions: { createNode },
    createNodeId,
    createContentDigest,
    reporter,
  } = args

  const {
    messagesPath,
    locales = localesArrayDefault,
    defaultLocale = 'en',
  } = options

  if (messagesPath == null) {
    reporter.panicOnBuild(
      'Please provide the path to the JSON files with translations'
    )

    return
  }

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

export const onCreateWebpackConfig = ({ actions }: CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        'react-intl$': 'react-intl/react-intl-no-parser.umd',
      },
    },
  })
}

export const onCreatePage = async ({
  page,
  actions,
  getNodesByType,
}: CreatePageArgs) => {
  const { createPage, deletePage } = actions

  // Check if originalPath was already set and bail early as otherwise an infinite loop could occur
  // as other plugins like gatsby-plugin-mdx could modify this
  if (page.context.originalPath) {
    return
  }

  const originalPath = page.path

  deletePage(page)

  const languageNodes = getNodesByType('LanguageData') as LanguageDataNode[]
  const languageConfig = getNodesByType(
    'LanguageDataConfig'
  )[0] as LanguageConfigNode

  const { defaultLocale } = languageConfig

  for (const languageData of languageNodes) {
    const { locale, messages } = languageData

    createPage({
      ...page,
      path: localizedPath(defaultLocale, locale, page.path),
      matchPath: page.matchPath
        ? localizedPath(defaultLocale, locale, page.matchPath)
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
