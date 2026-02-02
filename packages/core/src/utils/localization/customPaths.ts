import storeConfig from 'discovery.config'
import type { LocalesSettings } from 'src/typings/locales'

export type CustomPathInfo = {
  path: string
  locale: string
  /** Hostname from binding URL (for middleware rewrite rules; TODO: re-enable host validation) */
  hostname?: string
}

let cachedCustomPaths: CustomPathInfo[] | null = null

/** Returns path only (strip query ? and hash #) for prefix detection and building */
function getPathOnly(pathOrLink: string): string {
  return pathOrLink.split('?')[0].split('#')[0]
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
    // Match exact path or path with segment boundary (e.g., '/it' matches '/it' or '/it/apparel' but not '/item')
    if (pathOnly === path || pathOnly.startsWith(`${path}/`)) {
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
