import path from 'path'
import fs from 'fs'

import { withBasePath } from './directory'
import { myAccountPageTemplate } from './templates/myAccountPage'

const processExternalPages = (
  externalPagesPath: string,
  corePagesPath: string
) => {
  fs.readdirSync(externalPagesPath).forEach((file) => {
    const filePath = path.join(externalPagesPath, file)
    const destinationPath = path.join(corePagesPath, file)

    if (fs.statSync(filePath).isDirectory()) {
      // nested pages are not allowed
      throw new Error('Nested pages are not allowed')
    }

    const externalPagePath = `customizations/src/${filePath.replace(externalPagesPath, '')}`
    console.log({ externalPagePath })
    const content = myAccountPageTemplate(externalPagePath)
    fs.writeFileSync(destinationPath, content)
  })
}

export function createNextJsPages(basePath: string) {
  const { tmpDir } = withBasePath(basePath)

  const corePagesDir = path.join(tmpDir, 'src/pages')
  const customizationPagesDir = path.join(
    tmpDir,
    'src/customizations/src/pages'
  )

  console.log({ corePagesDir, customizationPagesDir })

  processExternalPages(customizationPagesDir, corePagesDir)
}
