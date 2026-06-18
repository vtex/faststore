/**
 * CP (Content Platform) schema helpers for `cms-sync`.
 * Generates and uploads the store's custom CMS schema via `vtex content`.
 * Store context only: no `-l` / base.jsonc, no core merge.
 */
import chalk from 'chalk'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { withBasePath } from './directory'
import { logger } from './logger'
import { runCommandSync } from './runCommandSync'

export function getExistingCpDirs(basePath: string): string[] {
  const { userCMSDir } = withBasePath(basePath)
  const componentsDir = path.join(userCMSDir, 'components')
  const pagesDir = path.join(userCMSDir, 'pages')

  return [componentsDir, pagesDir]
    .filter((dir) => existsSync(dir))
    .map((dir) => path.relative(basePath, dir))
}

export function errorNoCustomization(): never {
  logger.error(
    `${chalk.red('[Error]')} - No CMS customization found. Expected cms/faststore/components and/or cms/faststore/pages.`
  )
  process.exit(1)
}

export function getCpSchemaOutputPath(basePath: string): string {
  return path.join(withBasePath(basePath).userCMSDir, 'schema.json')
}

export function generateAndUploadSchema({
  basePath,
  dirs,
  schemaOut,
  dryRun,
}: {
  basePath: string
  dirs: string[]
  schemaOut: string
  dryRun: boolean
}): void {
  runCommandSync({
    cmd: `vtex content generate-schema ${dirs.join(' ')} -o ${schemaOut}`,
    cwd: basePath,
    throws: 'error',
    errorMessage: 'Failed to generate CMS schema',
  })

  if (dryRun) {
    return
  }

  runCommandSync({
    cmd: `vtex content upload-schema ${schemaOut}`,
    cwd: basePath,
    throws: 'error',
    errorMessage: 'Failed to upload CMS schema',
  })
}
