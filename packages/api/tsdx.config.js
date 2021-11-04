const graphql = require('@rollup/plugin-graphql')

module.exports = {
  rollup(config) {
    config.plugins.push(graphql())

    return config
  },
}
