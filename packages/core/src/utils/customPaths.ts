import storeConfig from 'discovery.config'
import type { LocalesSettings } from 'src/typings/locales'

export type CustomPathInfo = {
  path: string
  locale: string
}

// Cache for custom paths (computed once, reused)
let cachedCustomPaths: CustomPathInfo[] | null = null

/**
 * Checks if a URL has a custom path (not canonical format like /pt-BR)
 * @param url - The URL to check
 * @returns true if the URL has a custom path, false otherwise
 */
export function isCustomPath(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    if (pathname === '/' || pathname === '') {
      return false
    }

    const canonicalPathPattern = /^\/[a-z]{2}-[A-Z]{2}\/?$/i
    if (canonicalPathPattern.test(pathname)) {
      return false
    }

    return true
  } catch {
    return false
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

      if (!isCustomPath(binding.url)) {
        continue
      }

      try {
        const bindingUrl = new URL(binding.url)
        const pathname = bindingUrl.pathname

        if (!pathname || pathname === '/') {
          continue
        }

        const normalizedPath = pathname.replace(/\/$/, '')
        customPaths.push({
          path: normalizedPath,
          locale: localeCode,
        })
      } catch {
        continue
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
  const customPaths = getCustomPathsFromBindings()

  for (const { path } of customPaths) {
    // Match exact path or path with segment boundary (e.g., '/it' matches '/it' or '/it/apparel' but not '/item')
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return path
    }
  }

  return null
}

/**
 * Checks if a link already has a custom path prefix
 * @param link - The link to check (e.g., '/apparel' or '/europe/it/apparel')
 * @returns true if link already has a custom path prefix
 */
function hasCustomPathPrefix(link: string): boolean {
  if (!link.startsWith('/')) {
    return false
  }

  const customPaths = getCustomPathsFromBindings()

  for (const { path } of customPaths) {
    // Match exact path or path with segment boundary (e.g., '/it' matches '/it' or '/it/apparel' but not '/item')
    if (link === path || link.startsWith(`${path}/`)) {
      return true
    }
  }

  return false
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

  if (hasCustomPathPrefix(link)) {
    return link
  }

  const prefix = extractCustomPathPrefix(currentPathname)

  if (!prefix) {
    return link
  }

  return `${prefix}${link}`
}
