import fs from 'fs'
import path from 'path'

import { withBasePath } from './directory'
import { myAccountPageTemplate } from './templates/myAccountPage'

const ALLOWED_PREFIX_PAGES = ['/pvt/account']

type CreateExternalPagesArgs = {
  customizationPagesDir: string
  corePagesDir: string
  baseCustomizationPagesDir: string
}

const createExternalPages = ({
  customizationPagesDir,
  corePagesDir,
  baseCustomizationPagesDir,
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
      const externalPagePath = `src/customizations/src/pages${filePath.replace(baseCustomizationPagesDir, '').replace('.tsx', '')}`
      const content = myAccountPageTemplate(externalPagePath)
      fs.writeFileSync(destinationPath, content)
    }
  })
}

function isAllowedPrefixPage(file: string) {
  return ALLOWED_PREFIX_PAGES.some((prefix) => {
    return file.startsWith(prefix)
  })
}

export function createNextJsPages(basePath: string) {
  const { tmpDir } = withBasePath(basePath)

  const corePagesDir = path.join(tmpDir, 'src/pages')
  const customizationPagesDir = path.join(
    tmpDir,
    'src/customizations/src/pages'
  )

  if (!fs.existsSync(customizationPagesDir)) {
    // If the customization pages directory doesn't exist, we don't need to create any pages
    // and we can return early.
    return
  }

  const allPagesAreAllowed = ({
    basePath,
    dirPath,
  }: { basePath: string; dirPath: string }): boolean => {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })

    return items.every((item) => {
      const itemPath = path.join(dirPath, item.name)

      if (item.isDirectory()) {
        return allPagesAreAllowed({ basePath, dirPath: itemPath })
      }

      if (!item.isFile()) {
        return false // Reject anything that is not a file (symlinks, sockets, etc.)
      }

      const isNextPage = /\.(js|jsx|ts|tsx)$/.test(item.name)
      if (!isNextPage) {
        return false // Reject files that are not Next.js pages
      }

      // For Next.js page files, check if they match allowed prefixes
      const relativePath = path.relative(basePath, itemPath)
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
  })
}
