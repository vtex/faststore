import fs from 'node:fs'

import { logger } from './logger'

export type MyAccountCmsRoute = {
  route: string
  title: string
  contentType: string
}

/**
 * Extracts a property value from a static object-literal fragment when the
 * value is a plain string literal (single or double quotes).
 */
function readStringProp(
  objectLiteral: string,
  propName: string
): string | undefined {
  const pattern = new RegExp(
    `${propName}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`,
    'm'
  )
  const match = objectLiteral.match(pattern)
  return match?.[2]
}

/**
 * Locates the `routes: [ ... ]` array passed to `getMyAccountRoutes({...})`
 * and returns each top-level object-literal that declares a `contentType`.
 *
 * Supports the documented static-literal authoring pattern only. Dynamic /
 * computed route entries are skipped with a warning (they still work as
 * legacy code-only pages when a `.tsx` exists).
 */
export function readMyAccountCmsRoutes(
  navigationFilePath: string
): MyAccountCmsRoute[] {
  if (!fs.existsSync(navigationFilePath)) {
    return []
  }

  let sourceText: string
  try {
    sourceText = fs.readFileSync(navigationFilePath, 'utf8')
  } catch {
    logger.warn(
      `[my-account-cms] Could not read navigation file at ${navigationFilePath}`
    )
    return []
  }

  // Strip line comments to avoid false matches inside comments.
  const withoutLineComments = sourceText.replace(/^\s*\/\/.*$/gm, '')

  const routesMatch = withoutLineComments.match(
    /getMyAccountRoutes\s*\(\s*\{[\s\S]*?routes\s*:\s*\[([\s\S]*?)\]/
  )

  if (!routesMatch) {
    logger.warn(
      `[my-account-cms] Could not statically parse routes in ${navigationFilePath}; skipping CMS page generation`
    )
    return []
  }

  const routesBody = routesMatch[1]
  const objectLiterals = routesBody.match(/\{[^{}]*\}/g) ?? []

  const routes: MyAccountCmsRoute[] = []

  for (const literal of objectLiterals) {
    const contentType = readStringProp(literal, 'contentType')
    if (!contentType) {
      continue
    }

    const route = readStringProp(literal, 'route')
    const title = readStringProp(literal, 'title')

    if (!route || !title) {
      logger.warn(
        `[my-account-cms] Skipping CMS route entry missing route/title in ${navigationFilePath}`
      )
      continue
    }

    routes.push({ route, title, contentType })
  }

  return routes
}
