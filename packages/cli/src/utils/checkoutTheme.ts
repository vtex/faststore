import postcss from 'postcss'
import { Plugin } from 'postcss'
import postcssScss from 'postcss-scss'
import fs from 'fs'
import path from 'path'

import { getRoot, userStoreConfigFileDir, userThemesFileDir } from './directory'
import chalk from 'chalk'

const TOKEN_ALLOW_LIST = [
  '--fs-color-main-0',
  '--fs-color-main-1',
  '--fs-color-accent-0',
  '--fs-color-accent-1',
  '--fs-color-neutral-0',
  '--fs-color-neutral-1',
]

const plugin: Plugin = {
  postcssPlugin: 'postcss-checkout-css-plugin',

  // Comment: (comment) => {
  //   comment.remove();
  // },
  AtRule: (atRule) => {
    if (atRule?.nodes?.length === 0) {
      atRule.remove()
    }
  },

  Rule: (rule) => {
    if (rule.nodes.length === 0) {
      rule.remove()
    }
  },

  Declaration: (decl) => {
    if (!decl.variable || !TOKEN_ALLOW_LIST.includes(decl.prop)) {
      decl.remove()
    }
  },
}

export async function processAndCopyCheckoutTheme() {
  try {
    const storeConfig = await import(userStoreConfigFileDir)

    const customTheme = path.join(
      userThemesFileDir,
      `${storeConfig.theme}.scss`
    )
    const result = await postcss([plugin]).process(
      fs.readFileSync(customTheme, 'utf8'),
      {
        from: customTheme,
        to: path.join(getRoot(), '../client/src/pages/_document.module.scss'),
        parser: postcssScss.parse,
        stringifier: postcssScss.stringify,
      }
    )

    fs.writeFileSync(
      path.join(getRoot(), '../client/src/pages/_document.module.scss'),
      result.css
    )

    console.log(
      `${chalk.green('success')} - ${
        storeConfig.theme
      } has been applied to the checkout`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}
