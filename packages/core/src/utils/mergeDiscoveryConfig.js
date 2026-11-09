const deepmerge = require('deepmerge')

/**
 * Merges discovery configs like `deepmerge`, except that an empty
 * `api.subDomainPrefix` replaces the default instead of being appended to it.
 *
 * deepmerge concatenates arrays, so the default `['www']` is always kept. An
 * empty array is how a store asks for no prefix to be stripped from the host
 * sent to Checkout. Any other value is still appended to the default, as
 * before, to keep the current behavior of existing stores.
 */
function mergeDiscoveryConfig(target, source) {
  const merged = deepmerge(target, source)
  const subDomainPrefix = source?.api?.subDomainPrefix

  if (Array.isArray(subDomainPrefix) && subDomainPrefix.length === 0) {
    merged.api.subDomainPrefix = []
  }

  return merged
}

module.exports = { mergeDiscoveryConfig }
