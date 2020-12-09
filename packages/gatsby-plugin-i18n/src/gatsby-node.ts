import { join } from 'path'

import type {
  CreateBabelConfigArgs,
  CreatePageArgs,
  CreateWebpackConfigArgs,
  PluginOptionsSchemaArgs,
} from 'gatsby'

import { localizedPath } from './helpers/path'

const root = process.cwd()
const name = '@vtex/gatsby-plugin-i18n'

const base = join(root, 'src', name, 'i18n')

export const onCreateWebpackConfig = ({ actions }: CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        'intl-messageformat-parser': 'intl-messageformat-parser/dummy',
      },
    },
  })
}

export const onCreateBabelConfig = ({
  actions: { setBabelPlugin },
}: CreateBabelConfigArgs) => {
  setBabelPlugin({
    name: require.resolve('./babel'),
    options: {
      inPath: base,
    },
  })
}

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
