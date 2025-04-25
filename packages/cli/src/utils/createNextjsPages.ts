import path from 'path'
import fs from 'fs'

import { withBasePath } from './directory'
import { myAccountPageTemplate } from './templates/myAccountPage'

const ALLOWED_PREFIX_PAGES = ['/account']

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
  return ALLOWED_PREFIX_PAGES.some((prefix) => file.startsWith(prefix))
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

  const allPagesAreAllowed = fs
    .readdirSync(customizationPagesDir)
    .every((filePath) => isAllowedPrefixPage(path.join('/', filePath)))

  if (!allPagesAreAllowed) {
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
