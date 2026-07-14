import fs from 'node:fs'
import path from 'node:path'

import chalk from 'chalk'

import { withBasePath } from './directory'
import { logger } from './logger'
import {
  type MyAccountCmsRoute,
  readMyAccountCmsRoutes,
} from './readMyAccountCmsRoutes'
import { myAccountCmsPageTemplate } from './templates/myAccountCmsPage'
import { myAccountPageTemplate } from './templates/myAccountPage'

const ALLOWED_PREFIX_PAGES = ['/pvt/account']
const ACCOUNT_ROUTE_PREFIX = '/pvt/account'

type CreateExternalPagesArgs = {
  customizationPagesDir: string
  corePagesDir: string
  baseCustomizationPagesDir: string
  /** Routes that already have a CMS generated page (keyed by normalized route). */
  cmsHandledRoutes: Set<string>
}

const createExternalPages = ({
  customizationPagesDir,
  corePagesDir,
  baseCustomizationPagesDir,
  cmsHandledRoutes,
}: CreateExternalPagesArgs) => {
  fs.readdirSync(customizationPagesDir).forEach((file) => {
    const filePath = path.join(customizationPagesDir, file)
    const destinationPath = path.join(corePagesDir, file)
    if (fs.statSync(filePath).isDirectory()) {
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true })
      }
      return createExternalPages({
        customizationPagesDir: filePath,
        corePagesDir: destinationPath,
        baseCustomizationPagesDir,
        cmsHandledRoutes,
      })
    }

    const isReactFile = filePath.endsWith('.tsx')

    /* Checks if the destination path does not exist as a file or as a folder containing an "index.tsx" file.
     * This ensures that the path is available before proceeding with file creation or other operations.
     */
    const isDestinationAvailable =
      !fs.existsSync(destinationPath) &&
      !fs.existsSync(
        path.join(destinationPath.replace('.tsx', ''), 'index.tsx')
      )

    if (isReactFile && isDestinationAvailable) {
      const relativePagePath = filePath
        .replace(baseCustomizationPagesDir, '')
        .replace(/\\/g, '/')
        .replace(/\.tsx$/, '')
      const normalizedRoute = normalizeAccountRoute(relativePagePath)

      // Already generated as a CMS/hybrid page — skip legacy wrap.
      if (cmsHandledRoutes.has(normalizedRoute)) {
        return
      }

      const externalPagePath = `src/customizations/src/pages${relativePagePath}`
      const content = myAccountPageTemplate(externalPagePath)
      fs.writeFileSync(destinationPath, content)
    }
  })
}

function isAllowedPrefixPage(file: string) {
  return ALLOWED_PREFIX_PAGES.some((prefix) => file.startsWith(prefix))
}

function normalizeAccountRoute(routeOrRelativePath: string): string {
  const withSlash = routeOrRelativePath.startsWith('/')
    ? routeOrRelativePath
    : `/${routeOrRelativePath}`
  const withPvt = withSlash.startsWith('/pvt') ? withSlash : `/pvt${withSlash}`
  return withPvt.replace(/\/index$/, '') || withPvt
}

function routeToPageFilePath(corePagesDir: string, route: string): string {
  const relative = route.replace(/^\//, '') // pvt/account/wishlist
  return path.join(corePagesDir, `${relative}.tsx`)
}

function routeToCustomizationPagePath(
  customizationPagesDir: string,
  route: string
): string | null {
  // /pvt/account/wishlist → pvt/account/wishlist.tsx under customization pages
  const relative = route.replace(/^\//, '')
  if (!relative) return null

  const asFile = path.join(customizationPagesDir, `${relative}.tsx`)
  if (fs.existsSync(asFile)) return asFile

  const asIndex = path.join(customizationPagesDir, relative, 'index.tsx')
  if (fs.existsSync(asIndex)) return asIndex

  return null
}

function routeToExtensionImportBase(route: string): string {
  // /pvt/account/wishlist → wishlist ; /pvt/account/orders/foo → orders/foo
  return route.replace(ACCOUNT_ROUTE_PREFIX, '').replace(/^\//, '')
}

function resolveExtensionPaths(
  tmpDir: string,
  route: string
): { beforePath?: string; afterPath?: string } {
  const relative = routeToExtensionImportBase(route)
  if (!relative) return {}

  const extensionsDir = path.join(
    tmpDir,
    'src/customizations/src/myAccount/extensions',
    relative
  )

  const beforeFile = path.join(extensionsDir, 'before.tsx')
  const afterFile = path.join(extensionsDir, 'after.tsx')

  const importBase = `src/customizations/src/myAccount/extensions/${relative}`

  return {
    ...(fs.existsSync(beforeFile)
      ? { beforePath: `${importBase}/before` }
      : {}),
    ...(fs.existsSync(afterFile) ? { afterPath: `${importBase}/after` } : {}),
  }
}

function destinationExists(destinationPath: string): boolean {
  if (fs.existsSync(destinationPath)) return true

  const asIndex = path.join(destinationPath.replace(/\.tsx$/, ''), 'index.tsx')
  return fs.existsSync(asIndex)
}

function generateCmsPages({
  routes,
  corePagesDir,
  customizationPagesDir,
  tmpDir,
}: {
  routes: MyAccountCmsRoute[]
  corePagesDir: string
  customizationPagesDir: string
  tmpDir: string
}): Set<string> {
  const handled = new Set<string>()

  for (const { route, contentType } of routes) {
    const normalizedRoute = normalizeAccountRoute(route)

    if (!isAllowedPrefixPage(normalizedRoute)) {
      logger.warn(
        `${chalk.yellow('warning')} - Skipping CMS route ${normalizedRoute}: only ${ALLOWED_PREFIX_PAGES.join(', ')} prefixes are allowed`
      )
      continue
    }

    const destinationPath = routeToPageFilePath(corePagesDir, normalizedRoute)

    if (destinationExists(destinationPath)) {
      logger.warn(
        `${chalk.yellow('warning')} - Skipping CMS route ${normalizedRoute}: native page takes precedence`
      )
      continue
    }

    const customizationTsx = fs.existsSync(customizationPagesDir)
      ? routeToCustomizationPagePath(customizationPagesDir, normalizedRoute)
      : null

    const pagePath = customizationTsx
      ? `src/customizations/src/pages${customizationTsx
          .replace(customizationPagesDir, '')
          .replace(/\\/g, '/')
          .replace(/\.tsx$/, '')}`
      : undefined

    const { beforePath, afterPath } = resolveExtensionPaths(
      tmpDir,
      normalizedRoute
    )

    const content = myAccountCmsPageTemplate({
      contentType,
      routePath: normalizedRoute,
      pagePath,
      beforePath,
      afterPath,
    })

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
    fs.writeFileSync(destinationPath, content)
    handled.add(normalizedRoute)

    logger.log(
      `${chalk.green('success')} - Generated CMS My Account page for ${normalizedRoute} (${contentType}${pagePath ? ', hybrid' : ''})`
    )
  }

  return handled
}

export function createNextJsPages(basePath: string) {
  const { tmpDir } = withBasePath(basePath)

  const corePagesDir = path.join(tmpDir, 'src/pages')
  const customizationPagesDir = path.join(
    tmpDir,
    'src/customizations/src/pages'
  )
  const navigationFilePath = path.join(
    tmpDir,
    'src/customizations/src/myAccount/navigation.ts'
  )

  const cmsRoutes = readMyAccountCmsRoutes(navigationFilePath)
  const cmsHandledRoutes = generateCmsPages({
    routes: cmsRoutes,
    corePagesDir,
    customizationPagesDir,
    tmpDir,
  })

  if (!fs.existsSync(customizationPagesDir)) {
    // No customization pages — Mode A CMS pages (if any) were still generated above.
    return
  }

  const allPagesAreAllowed = ({
    basePath: pagesBase,
    dirPath,
  }: { basePath: string; dirPath: string }): boolean => {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })

    // Empty pages dir is fine (Mode A only).
    if (items.length === 0) return true

    return items.every((item) => {
      const itemPath = path.join(dirPath, item.name)

      if (item.isDirectory()) {
        return allPagesAreAllowed({ basePath: pagesBase, dirPath: itemPath })
      }

      if (!item.isFile()) {
        return false // Reject anything that is not a file (symlinks, sockets, etc.)
      }

      const isNextPage = /\.(js|jsx|ts|tsx)$/.test(item.name)
      if (!isNextPage) {
        return false // Reject files that are not Next.js pages
      }

      // For Next.js page files, check if they match allowed prefixes
      const relativePath = path.relative(pagesBase, itemPath)
      const normalizedPath =
        '/' + relativePath.replace(/\\/g, '/').replace(/\.(js|jsx|ts|tsx)$/, '')

      return isAllowedPrefixPage(normalizedPath)
    })
  }

  const pagesAreAllowed = allPagesAreAllowed({
    basePath: customizationPagesDir,
    dirPath: customizationPagesDir,
  })

  if (!pagesAreAllowed) {
    throw new Error(
      `Only these prefix pages: (${ALLOWED_PREFIX_PAGES.join(', ')}) are allowed`
    )
  }

  createExternalPages({
    customizationPagesDir,
    corePagesDir,
    baseCustomizationPagesDir: customizationPagesDir,
    cmsHandledRoutes,
  })
}
