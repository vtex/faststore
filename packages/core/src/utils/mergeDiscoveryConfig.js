const deepmerge = require('deepmerge')

// Keys whose value from the store config replaces the default one instead of
// being merged into it. deepmerge concatenates arrays by default, so without
// this `api.subDomainPrefix: []` would end up as `['www']`.
const OVERRIDE_KEYS = ['subDomainPrefix']

const overwrite = (_target, source) => source

/**
 * Merges discovery configs like `deepmerge`, except that the keys listed in
 * `OVERRIDE_KEYS` take the source value as is.
 */
function mergeDiscoveryConfig(target, source) {
  return deepmerge(target, source, {
    customMerge: (key) => (OVERRIDE_KEYS.includes(key) ? overwrite : undefined),
  })
}

module.exports = { mergeDiscoveryConfig }
