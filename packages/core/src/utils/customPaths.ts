import storeConfig from 'discovery.config'
import type { LocalesSettings } from 'src/typings/locales'

export type CustomPathInfo = {
  path: string
  locale: string
}

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
 * @returns Array of custom path information (path and locale)
 */
export function getCustomPathsFromBindings(): CustomPathInfo[] {
  const customPaths: CustomPathInfo[] = []

  if (!storeConfig.localization?.enabled) {
    return customPaths
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

  return customPaths.sort((a, b) => b.path.length - a.path.length)
}
