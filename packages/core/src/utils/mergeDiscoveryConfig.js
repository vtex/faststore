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

  const invalidUrls = ['storeUrl', 'secureSubdomain'].filter(
    (key) => config[key] && !getHostname(config[key])
  )

  if (invalidUrls.length > 0) {
    return (
      `[FastStore] api.subDomainPrefix is [], but ${invalidUrls.join(' and ')} could not be parsed as a URL, ` +
      `so it was not possible to check where Checkout cookies are sent. Use a full URL (e.g. https://www.store.com).`
    )
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
