import storeConfig from 'discovery.config'
import type { LocalesSettings } from 'src/typings/locales'

export type CustomPathInfo = {
  path: string
  locale: string
  hostname?: string
}

let cachedCustomPaths: CustomPathInfo[] | null = null

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
 * Parses URL and returns normalized pathname and hostname when it has a custom path, null otherwise.
 */
function parseCustomPathUrl(
  url: string
): { path: string; hostname: string } | null {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    if (!pathname || pathname === '/') {
      return null
    }

    // Only treat as canonical (not custom) paths that match a configured locale
    const localeCodes = storeConfig.localization?.enabled
      ? (Object.keys(storeConfig.localization?.locales ?? {}) as string[])
      : []
    const normalizedPathname = pathname.replace(/\/$/, '')
    if (localeCodes.some((code) => normalizedPathname === `/${code}`)) {
      return null
    }

    return { path: normalizedPathname, hostname: urlObj.hostname }
  } catch {
    return null
  }
}

/**
 * Extracts custom paths from localization bindings configuration
 * Results are cached for performance
 * @returns Array of custom path information (path and locale)
 */
export function getCustomPathsFromBindings(): CustomPathInfo[] {
  if (cachedCustomPaths !== null) {
    return cachedCustomPaths
  }

  const customPaths: CustomPathInfo[] = []

  if (!storeConfig.localization?.enabled) {
    cachedCustomPaths = customPaths
    return cachedCustomPaths
  }

  const locales = (storeConfig.localization.locales ||
    {}) as LocalesSettings['locales']

  for (const [localeCode, localeConfig] of Object.entries(locales)) {
    if (!localeConfig?.bindings || !Array.isArray(localeConfig.bindings)) {
      continue
    }

    for (const binding of localeConfig.bindings) {
      if (!binding.url) {
        continue
      }

      const result = parseCustomPathUrl(binding.url)
      if (result) {
        customPaths.push({
          path: result.path,
          locale: localeCode,
          hostname: result.hostname,
        })
      }
    }
  }

  cachedCustomPaths = customPaths.sort((a, b) => b.path.length - a.path.length)
  return cachedCustomPaths
}

/**
 * Extracts custom path prefix from current pathname
 * @param pathname - Current pathname (e.g., '/europe/it/apparel')
 * @returns Custom path prefix if found, null otherwise
 */
function extractCustomPathPrefix(pathname: string): string | null {
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
