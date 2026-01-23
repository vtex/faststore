import { getCustomPathsFromBindings } from './customPaths'

/**
 * Extracts custom path prefix from current pathname
 * @param pathname - Current pathname (e.g., '/europe/it/apparel')
 * @returns Custom path prefix if found, null otherwise
 */
function extractCustomPathPrefix(pathname: string): string | null {
  const customPaths = getCustomPathsFromBindings()

  for (const { path } of customPaths) {
    if (pathname.startsWith(path)) {
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
    if (link.startsWith(path)) {
      return true
    }
  }

  return false
}

/**
 * Adds custom path prefix to a link if needed
 * @param link - The link from CMS (e.g., '/apparel' or '/europe/it/apparel')
 * @param currentPathname - Current pathname (e.g., '/europe/it/apparel')
 * @returns Link with prefix if needed (e.g., '/europe/it/apparel')
 */
export function addCustomPathPrefix(
  link: string,
  currentPathname: string
): string {
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
