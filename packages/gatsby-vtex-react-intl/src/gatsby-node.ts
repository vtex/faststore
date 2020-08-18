import { CreateWebpackConfigArgs, ParentSpanPluginArgs } from 'gatsby'
import path from 'path'

let didRunAlready = false
let absoluteLocaleDirectory: string | undefined

interface PluginOptions {
  defaultLocale?: string
}

exports.onPreInit = ({ store }: ParentSpanPluginArgs, { defaultLocale }: PluginOptions) => {
  // defaultLocale must be defined, no default option will be defined
  if (!defaultLocale) {
    throw new Error(`
      Please define the 'defaultLocale' option of gatsby-theme-i18n-react-intl
    `)
  }

  const localesPath = path.join(
    store.getState().program.directory,
    defaultLocale
  )

  if (didRunAlready) {
    throw new Error(
      `You can only have single instance of gatsby-theme-i18n-react-intl in your gatsby-config.js`
    )
  }

  didRunAlready = true
  // The defaultLocale is the path to a file, but since we want to require multiple json files
  // this should really be the directory where the files are located, thus path.dirname
  absoluteLocaleDirectory = path.dirname(localesPath)
}

exports.onCreateWebpackConfig = ({ actions, plugins }: CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_THEME_I18N_REACT_INTL: JSON.stringify(absoluteLocaleDirectory),
      }),
    ],
  })
}
