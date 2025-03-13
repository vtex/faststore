import path from 'path'
import fs from 'fs'

import { withBasePath } from './directory'
import { myAccountPageTemplate } from './templates/myAccountPage'

const ALLOWED_PREFIX_PAGES = ['/account']

const createExternalPages = (
  customizationPagesDir: string,
  corePagesDir: string,
  baseCustomizationPagesDir: string
) => {
  fs.readdirSync(customizationPagesDir).forEach((file) => {
    const filePath = path.join(customizationPagesDir, file)
    const destinationPath = path.join(corePagesDir, file)
    if (fs.statSync(filePath).isDirectory()) {
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true })
      }
      return createExternalPages(
        filePath,
        destinationPath,
        baseCustomizationPagesDir
      )
    }

    if (file.endsWith('.tsx') && !fs.existsSync(destinationPath)) {
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

  const allPagesAreAllowed = fs
    .readdirSync(customizationPagesDir)
    .every((filePath) => isAllowedPrefixPage(path.join('/', filePath)))

  if (!allPagesAreAllowed) {
    throw new Error(
      `Only these prefix pages: (${ALLOWED_PREFIX_PAGES.join(', ')}) are allowed`
    )
  }

  createExternalPages(
    customizationPagesDir,
    corePagesDir,
    customizationPagesDir
  )
}
