// @ts-check

/**
 * Checks if a binding is path-based (has a path segment)
 * @param {Object} binding - The binding object with url property
 * @returns {boolean} True if binding has a path (path-based routing)
 */
function isPathBasedBinding(binding) {
  if (!binding || !binding.url) {
    return false
  }

  try {
    const bindingUrl = new URL(binding.url)
    return isNonRootPath(bindingUrl.pathname)
  } catch (error) {
    console.warn(
      `Invalid binding URL: ${binding.url}. Error: ${error?.message || String(error)}`
    )
    return false
  }
}

function isNonRootPath(pathname) {
  return Boolean(pathname && pathname !== '/')
}

/**
 * Checks if a binding is a valid domain-based binding (no path)
 * A binding is domain-based if it has no path (or only root path '/')
 * @param {Object} binding - The binding object with url property
 * @returns {string|null} The hostname if valid domain-based binding, or null if path-based
 */
function getValidSubdomainBinding(binding) {
  if (!binding || !binding.url) {
    return null
  }

  try {
    const bindingUrl = new URL(binding.url)
    const bindingHostname = bindingUrl.hostname

    if (isNonRootPath(bindingUrl.pathname)) {
      // path-based binding
      return null
    }

    return bindingHostname
  } catch (error) {
    console.warn(
      `Invalid binding URL: ${binding.url}. Error: ${error?.message || String(error)}`
    )
    return null
  }
}

/**
 * Extracts path-based locales from SDK bindings
 * @param {Object} [localesSettings={}] - The locales settings object
 * @returns {string[]} Array of locale codes that have path-based bindings
 */
function buildI18nLocales(localesSettings = {}) {
  const pathBasedLocales = new Set()

  for (const [localeCode, localeData] of Object.entries(
    localesSettings.locales || {}
  )) {
    if (!localeData.bindings || !Array.isArray(localeData.bindings)) {
      continue
    }

    const hasPathBasedBinding = localeData.bindings.some((binding) =>
      isPathBasedBinding(binding)
    )

    if (hasPathBasedBinding) {
      pathBasedLocales.add(localeCode)
    }
  }

  return Array.from(pathBasedLocales)
}

/**
 * Extracts subdomain-to-locale mappings from SDK bindings and builds Next.js i18n domains configuration
 * @param {Object} [localesSettings={}] - The locales settings object
 * @returns {Array<{domain: string, defaultLocale: string}>}
 */
function buildI18nDomains(localesSettings = {}) {
  const domainMap = new Map()

  for (const [localeCode, localeData] of Object.entries(
    localesSettings.locales || {}
  )) {
    if (!localeData.bindings || !Array.isArray(localeData.bindings)) {
      continue
    }

    for (const binding of localeData.bindings) {
      const hostname = getValidSubdomainBinding(binding)

      if (!hostname) {
        continue
      }

      if (!domainMap.has(hostname)) {
        domainMap.set(hostname, {
          domain: hostname,
          defaultLocale: localeCode,
        })
      } else {
        const existingLocale = domainMap.get(hostname).defaultLocale
        console.warn(
          `Duplicate domain: ${hostname} already mapped to locale ${existingLocale}, ignoring duplicate from locale ${localeCode}.`
        )
      }
    }
  }

  return Array.from(domainMap.values())
}

module.exports = {
  buildI18nDomains,
  buildI18nLocales,
}
