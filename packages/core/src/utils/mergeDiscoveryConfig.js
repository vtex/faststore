const deepmerge = require('deepmerge')

// deepmerge concatenates arrays, so the default `api.subDomainPrefix: ['www']`
// is always kept. An empty array is how a store asks for no prefix to be
// stripped, so it replaces the default. Any other value is still appended to
// the default, as before, to keep the current behavior of existing stores.
const mergeSubDomainPrefix = (target, source) =>
  Array.isArray(source) && source.length === 0
    ? source
    : deepmerge(target, source)

/**
 * Merges discovery configs like `deepmerge`, except that an empty
 * `subDomainPrefix` replaces the default instead of being appended to it.
 */
function mergeDiscoveryConfig(target, source) {
  return deepmerge(target, source, {
    customMerge: (key) =>
      key === 'subDomainPrefix' ? mergeSubDomainPrefix : undefined,
  })
}

const getHostname = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

/**
 * With `api.subDomainPrefix: []`, Checkout cookies are set on the storefront
 * host only, so a checkout served from another host (`secureSubdomain`) does
 * not receive them. Returns a warning for that setup, or `undefined`.
 */
function getSubDomainPrefixWarning(config) {
  const prefixes = config?.api?.subDomainPrefix

  if (!Array.isArray(prefixes) || prefixes.length > 0) {
    return undefined
  }

  const storeHost = getHostname(config.storeUrl)
  const secureHost = getHostname(config.secureSubdomain)

  if (!storeHost || !secureHost || storeHost === secureHost) {
    return undefined
  }

  return (
    `[FastStore] api.subDomainPrefix is [], so Checkout cookies are set on ${storeHost} only ` +
    `and are not sent to the secureSubdomain (${secureHost}). If the checkout runs on ${secureHost}, ` +
    `remove api.subDomainPrefix or set it to the prefixes to strip (e.g. ['www']).`
  )
}

module.exports = { mergeDiscoveryConfig, getSubDomainPrefixWarning }
