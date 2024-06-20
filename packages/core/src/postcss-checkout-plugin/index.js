/**
 * @type {import('postcss').PluginCreator}
 */

const allowList = [
  '--fs-color-main-0',
  '--fs-color-main-1',
  '--fs-color-accent-0',
  '--fs-color-accent-1',
  '--fs-color-neutral-0',
  '--fs-color-neutral-1',
]

module.exports = () => {
  // Work with options here
  return {
    postcssPlugin: 'postcss-checkout-css-plugin',

    // Comment: (comment) => {
    //   comment.remove();
    // },
    AtRule: (atRule) => {
      if (atRule.nodes.length === 0) {
        atRule.remove()
      }
    },

    Rule: (rule) => {
      if (rule.nodes.length === 0) {
        rule.remove()
      }
    },

    Declaration: (decl) => {
      if (!decl.variable || !allowList.includes(decl.prop)) {
        decl.remove()
      }
    },
  }
}

module.exports.postcss = true
