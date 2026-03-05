// @ts-check

// Builds Next.js i18n domains configuration from locale settings

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
    const bindingPathname = bindingUrl.pathname

    if (bindingPathname && bindingPathname !== '/') {
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
}
