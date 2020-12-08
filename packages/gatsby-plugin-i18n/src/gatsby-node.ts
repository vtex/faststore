import type { CreatePageArgs, PluginOptionsSchemaArgs } from 'gatsby'
// import { readJSON, outputFile, unlink } from 'fs-extra'
// import { compile } from '@formatjs/cli'

import { localizedPath } from './helpers/path'

// export const sourceNodes = async (
//   args: SourceNodesArgs,
//   options: PluginOptions
// ) => {
//   const {
//     actions: { createNode },
//     createNodeId,
//     createContentDigest,
//     reporter,
//   } = args
//   const {
//     locales,
//     defaultLocale,
//   } = options
//   for (const locale of locales) {
//     let languageJson = null as Record<string, string> | null
//     if (languageJson == null) {
//       reporter.info(`Error reading strings for locale ${locale}`)
//       continue
//     }
//     const withDefaultMessage = Object.entries(languageJson).reduce(
//       (acc, [key, val]) => {
//         acc[key] = { defaultMessage: val }
//         return acc
//       },
//       {} as Record<string, { defaultMessage: string }>
//     )
//     await outputFile(
//       `${messagesPath}/${locale}-temp.json`,
//       JSON.stringify(withDefaultMessage)
//     )
//     const resultAsString = await compile(
//       [`${messagesPath}/${locale}-temp.json`],
//       { ast: true }
//     )
//     await unlink(`${messagesPath}/${locale}-temp.json`)
//     const data = { messages: resultAsString, locale }
//     createNode({
//       ...data,
//       id: createNodeId(`LanguageData-${locale}`),
//       internal: {
//         type: 'LanguageData',
//         content: JSON.stringify(data),
//         contentDigest: createContentDigest(data),
//       },
//     })
//   }
//   const languageDataConfig = {
//     locales,
//     defaultLocale,
//   }
//   createNode({
//     ...languageDataConfig,
//     id: createNodeId(`LanguageDataConfig`),
//     internal: {
//       type: 'LanguageDataConfig',
//       content: JSON.stringify(languageDataConfig),
//       contentDigest: createContentDigest(languageDataConfig),
//     },
//   })
// }

// export const onCreateWebpackConfig = ({ actions }: CreateWebpackConfigArgs) => {
//   actions.setWebpackConfig({
//     resolve: {
//       alias: {
//         'react-intl$': 'react-intl/react-intl-no-parser.umd',
//       },
//     },
//   })
// }

export const onCreatePage = async (
  { page, actions }: CreatePageArgs,
  { defaultLocale, locales }: PluginOptions
) => {
  const { createPage, deletePage } = actions

  // Check if originalPath was already set and bail early as otherwise an infinite loop could occur
  // as other plugins like gatsby-plugin-mdx could modify this
  if (page.context.originalPath) {
    return
  }

  const { path, matchPath } = page

  deletePage(page)

  for (const locale of locales) {
    createPage({
      ...page,
      path: localizedPath(defaultLocale, locale, path),
      matchPath: matchPath && localizedPath(defaultLocale, locale, matchPath),
      context: {
        ...page.context,
        originalPath: path,
      },
    })
  }
}

export interface PluginOptions {
  locales: string[]
  defaultLocale: string
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    locales: Joi.array().items(Joi.string()).required(),
    defaultLocale: Joi.string().required(),
  })
