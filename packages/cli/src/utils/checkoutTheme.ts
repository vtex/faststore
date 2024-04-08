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
  '--fs-color-main-2',
  '--fs-color-main-3',
  '--fs-color-main-4',
  '--fs-color-success-bkg',
  '--fs-color-warning-bkg',
  '--fs-color-danger-bkg',
  '--fs-color-primary-bkg-light',
  '--fs-text-weight-bold',
  '--fs-text-weight-black',
  '--fs-text-face-body',
  '--fs-text-size-title-huge',
  '--fs-grid-padding',
  '--fs-border-color',
  '--fs-border-radius',
  '--fs-button-padding',
  '--fs-button-border-radius',
  '--fs-button-border-width',
  '--fs-buy-button-bkg-color',
  '--fs-buy-button-bkg-color-hover',
  '--fs-buy-button-bkg-color-active',
  '--fs-button-secondary-text-color-hover',
  '--fs-button-secondary-bkg-color-hover',
  '--fs-button-secondary-bkg-color-active',
  '--fs-button-secondary-border-color',
  '--fs-button-secondary-inverse-text-color',
  '--fs-button-secondary-inverse-text-color-hover',
  '--fs-button-secondary-inverse-bkg-color-hover',
  '--fs-button-secondary-inverse-bkg-color-active',
  '--fs-button-secondary-inverse-border-color',
  '--fs-button-secondary-inverse-border-color-hover',
  '--fs-button-secondary-inverse-border-color-active',
  '--fs-input-height',
  '--fs-input-border-radius',
  '--fs-input-field-padding',
  '--fs-input-field-label-padding',
  '--fs-qty-selector-border-radius',
  '--fs-carousel-controls-box-shadow',
  '--fs-carousel-controls-bkg-color',
  '--fs-carousel-controls-icon-color',
  '--fs-carousel-bullet-bkg-color-selected',
  '--fs-carousel-item-margin-right',
  '--fs-alert-bkg-color',
  '--fs-alert-text-color',
  '--fs-product-card-wide-content-padding',
  '--fs-product-card-border-width',
  '--fs-product-card-title-weight',
  '--fs-product-card-wide-bkg-color',
  '--fs-product-card-padding',
  '--fs-product-card-shadow-hover',
  '--fs-badge-neutral-bkg-color',
  '--fs-badge-text-color',
  '--fs-badge-big-padding',
  '--fs-slide-over-partial-width-notebook',
  '--fs-slide-over-partial-max-width-notebook',
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
