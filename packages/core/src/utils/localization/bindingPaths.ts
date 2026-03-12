import storeConfig from 'discovery.config'
import type { LocalesSettings } from 'src/typings/locales'
import { filterChannel } from 'src/utils/utilities'

export type CustomPathInfo = {
  path: string
  locale: string
  hostname?: string
}

export type SubdomainBinding = {
  hostname: string
  locale: string
}

type BindingsByType = {
  customPaths: CustomPathInfo[]
  subdomainBindings: SubdomainBinding[]
}

let bindingsByTypeCache: BindingsByType | null = null

/** Returns path only (strip query ? and hash #) for prefix detection and building */
function getPathOnly(pathOrLink: string): string {
  return pathOrLink.split('?')[0].split('#')[0]
}

/**
 * Checks if an incoming path matches a binding path.
 * Supports exact match and prefix matching for paths with additional segments.
 * @param incomingPath - The path from the URL being checked (e.g., '/europe/it/products')
 * @param bindingPath - The path from the binding configuration (e.g., '/europe/it')
 * @returns true if they match (exact or prefix match)
 * @example
 * matchesBindingPath('/europe/it', '/europe/it') // true (exact match)
 * matchesBindingPath('/europe/it/products', '/europe/it') // true (prefix match)
 * matchesBindingPath('/europe/item', '/europe/it') // false (not a match)
 * matchesBindingPath('/pt-BR/office', '/pt-BR') // true (prefix match)
 * matchesBindingPath('/', '/') // true (root match)
 */
export function matchesBindingPath(
  incomingPath: string,
  bindingPath: string
): boolean {
  // Normalize paths (remove trailing slash, but keep '/' for root)
  const normalizedIncoming =
    incomingPath.replace(/\/$/, '').toLowerCase() || '/'
  const normalizedBinding = bindingPath.replace(/\/$/, '').toLowerCase() || '/'

  // Root path only matches exact root
  if (normalizedBinding === '/') {
    return normalizedIncoming === '/'
  }

  // For non-root paths, match exact or prefix
  return (
    normalizedIncoming === normalizedBinding ||
    normalizedIncoming.startsWith(`${normalizedBinding}/`)
  )
}

/**
 * Checks whether a locale code exists in the localization configuration.
 */
export function isValidLocale(locale: string): boolean {
  if (!storeConfig.localization?.enabled) {
    return false
  }

  return locale in (storeConfig.localization.locales || {})
}

/**
 * Single pass over all locale bindings, classifying each as either a
 * custom-path binding (has a non-root pathname) or a subdomain binding
 * (root pathname — hostname alone determines the locale).
 * Results are cached after the first call.
 */
function getBindingsByType(): BindingsByType {
  if (bindingsByTypeCache !== null) {
    return bindingsByTypeCache
  }

  const customPaths: CustomPathInfo[] = []
  const subdomainBindings: SubdomainBinding[] = []

  if (!storeConfig.localization?.enabled) {
    bindingsByTypeCache = { customPaths, subdomainBindings }
    return bindingsByTypeCache
  }

  const locales = (storeConfig.localization.locales ||
    {}) as LocalesSettings['locales']
  const localeCodes = new Set(Object.keys(locales))

  for (const [localeCode, localeConfig] of Object.entries(locales)) {
    if (!localeConfig?.bindings || !Array.isArray(localeConfig.bindings)) {
      continue
    }

    for (const binding of localeConfig.bindings) {
      if (!binding.url) {
        continue
      }

      try {
        const urlObj = new URL(binding.url)
        const pathname = urlObj.pathname.replace(/\/$/, '') || '/'

        if (pathname === '/') {
          subdomainBindings.push({
            hostname: urlObj.hostname,
            locale: localeCode,
          })
        } else if (!localeCodes.has(pathname.slice(1))) {
          customPaths.push({
            path: pathname,
            locale: localeCode,
            hostname: urlObj.hostname,
          })
        }
      } catch {
        console.warn(
          `[bindingPaths] Skipping invalid binding URL: "${binding.url}"`
        )
        continue
      }
    }
  }

  customPaths.sort((a, b) => b.path.length - a.path.length)

  bindingsByTypeCache = { customPaths, subdomainBindings }
  return bindingsByTypeCache
}

/**
 * Returns bindings that use a custom URL path (non-root pathname).
 * Sorted by path length descending (most specific first).
 */
export function getCustomPathsFromBindings(): CustomPathInfo[] {
  return getBindingsByType().customPaths
}

/**
 * Returns bindings where the hostname alone determines the locale
 * (root pathname '/').
 */
export function getSubdomainBindings(): SubdomainBinding[] {
  return getBindingsByType().subdomainBindings
}

/**
 * Extracts custom path prefix from current pathname
 * @param pathname - Current pathname (e.g., '/europe/it/apparel')
 * @returns Custom path prefix if found, null otherwise
 */
export function extractCustomPathPrefix(pathname: string): string | null {
  const pathOnly = getPathOnly(pathname)
  const customPaths = getCustomPathsFromBindings()

  for (const { path } of customPaths) {
    if (matchesBindingPath(pathOnly, path)) {
      return path
    }
  }

  return null
}

/**
 * Adds custom path prefix to a link if needed
 * @param link - The link href (e.g., '/apparel' or '/europe/it/apparel')
 * @param currentPathname - Current pathname (e.g., '/europe/it/apparel')
 * @returns Link with prefix if needed (e.g., '/europe/it/apparel')
 */
export function addCustomPathPrefix(
  link: string,
  currentPathname: string
): string {
  if (!storeConfig.localization?.enabled) {
    return link
  }

  if (!link.startsWith('/')) {
    return link
  }

  if (extractCustomPathPrefix(link) !== null) {
    return link
  }

  const prefix = extractCustomPathPrefix(currentPathname)

  if (!prefix) {
    return link
  }

  const pathOnly = getPathOnly(link)
  const queryAndHash = link.slice(pathOnly.length)
  return `${prefix}${pathOnly}${queryAndHash}`
}

/**
 * Collects all binding URL paths from the locales config (both locale-code
 * paths like "/pt-BR" and custom paths like "/europe/it").
 * Returns deduplicated paths sorted by length descending (most specific first).
 *
 * Unlike `getCustomPathsFromBindings`, this does NOT filter out locale-code paths.
 *
 * @returns Array of binding path strings sorted longest-first
 */
export function collectAllBindingPaths(): string[] {
  if (!storeConfig.localization?.enabled) {
    return []
  }

  const locales = (storeConfig.localization.locales ||
    {}) as LocalesSettings['locales']
  const pathSet = new Set<string>()

  for (const localeConfig of Object.values(locales)) {
    if (!localeConfig?.bindings || !Array.isArray(localeConfig.bindings)) {
      continue
    }

    for (const binding of localeConfig.bindings) {
      if (!binding.url) {
        continue
      }

      try {
        const pathname = new URL(binding.url).pathname.replace(/\/$/, '')

        if (pathname && pathname !== '/') {
          pathSet.add(pathname)
        }
      } catch {
        console.warn(
          `[bindingPaths] Skipping invalid binding URL: "${binding.url}"`
        )
      }
    }
  }

  return Array.from(pathSet).sort((a, b) => b.length - a.length)
}

/**
 * Strips the current binding path prefix from `currentPathname`, returning the
 * remaining "page path" (e.g. "/products/item").
 *
 * @param currentPathname - The full browser pathname (e.g., "/pt-BR/products/item")
 * @returns The page path after stripping the matched prefix, or the full pathname if none matches
 */
export function getPagePath(currentPathname: string): string {
  const pathOnly = getPathOnly(currentPathname)
  const bindingPaths = collectAllBindingPaths()

  for (const bp of bindingPaths) {
    if (matchesBindingPath(pathOnly, bp)) {
      const normalizedBp = bp.replace(/\/$/, '').toLowerCase()
      const normalizedPath = pathOnly.replace(/\/$/, '').toLowerCase()

      if (normalizedPath === normalizedBp) {
        return ''
      }

      const prefixEnd =
        normalizedPath.indexOf(normalizedBp) === 0 ? bp.length : 0

      return prefixEnd > 0 ? pathOnly.slice(prefixEnd) : pathOnly
    }
  }

  return pathOnly
}

/**
 * Resolves the channel string for a given locale by looking up its
 * binding's salesChannel. Falls back to the default session channel when the
 * locale is unknown or localization is disabled.
 *
 * The returned string is a JSON channel object (same format used by
 * `storeConfig.session.channel`) with `hasOnlyDefaultSalesChannel` stripped so
 * it can be passed directly as a `channel` facet/locator value.
 */
export function getChannelForLocale(locale: string | undefined): string {
  const defaultChannel = storeConfig.session.channel

  if (!locale || !storeConfig.localization?.enabled) {
    return filterChannel(defaultChannel)
  }

  const localeConfig = (storeConfig.localization.locales ?? {})[locale]

  if (!localeConfig?.bindings?.length) {
    return filterChannel(defaultChannel)
  }

  const binding =
    localeConfig.bindings.find((b) => b.isDefault) ?? localeConfig.bindings[0]

  if (!binding?.salesChannel) {
    return filterChannel(defaultChannel)
  }

  const channelObj = JSON.parse(defaultChannel)
  channelObj.salesChannel = binding.salesChannel

  return filterChannel(JSON.stringify(channelObj))
}

/**
 * Builds a redirect URL by combining the target binding URL with the current
 * page path and query string.
 *
 * @param bindingUrl - The new binding's base URL (e.g., "http://localhost:3000/en-US")
 * @param currentUrl - The current page URL path including query string (e.g., "/pt-BR/products/item?color=red")
 * @returns The full redirect URL preserving the page path and query string
 */
export function buildRedirectUrl(
  bindingUrl: string,
  currentUrl: string
): string {
  const pathOnly = getPathOnly(currentUrl)
  const suffix = currentUrl.slice(pathOnly.length)

  const pagePath = getPagePath(pathOnly)
  const baseUrl = bindingUrl.replace(/\/$/, '')

  return `${baseUrl}${pagePath}${suffix}`
}
