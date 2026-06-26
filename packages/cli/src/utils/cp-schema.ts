/**
 * CP (Content Platform) schema helpers for `cms-sync`.
 * Generates and uploads the store's custom CMS schema via `vtex content`.
 * Store context only: no `-l` / base.jsonc, no core merge.
 */
import chalk from 'chalk'
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { withBasePath } from './directory'
import { logger } from './logger'
import { runCommandSync } from './runCommandSync'

const MY_ACCOUNT_SUBDIRS = ['components', 'pages'] as const

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

export type MyAccountMerge = {
  /** Temporary root directory holding the merged My Account JSONC. */
  mergeDir: string
  /** Absolute paths of the merged subdirectories to feed to generate-schema. */
  dirs: string[]
}

/**
 * Builds a temporary directory with the My Account CMS JSONC, ready to be fed
 * to `generate-schema`.
 *
 * The My Account schemas are intentionally excluded from the published base
 * schema (and the Schema Registry), so they must be supplied locally when the
 * `experimental.enableFaststoreMyAccount` flag is on. They are copied from the
 * installed `@faststore/core`; this temp dir is also the seam where a future
 * store-side My Account customization could be overlaid per-file.
 *
 * Exits the process when the core My Account schemas are not found.
 */
export function prepareMyAccountMergeDir(basePath: string): MyAccountMerge {
  const coreMyAccountDir = path.join(
    withBasePath(basePath).coreCMSDir,
    'my-account'
  )

  if (!existsSync(coreMyAccountDir)) {
    logger.error(
      `${chalk.red('[Error]')} - My Account is enabled but the core My Account schemas were not found at ${coreMyAccountDir}. Update @faststore/core or disable experimental.enableFaststoreMyAccount.`
    )
    process.exit(1)
  }

  const mergeDir = mkdtempSync(
    path.join(os.tmpdir(), 'faststore-cms-myaccount-')
  )

  const dirs: string[] = []
  for (const subdir of MY_ACCOUNT_SUBDIRS) {
    const source = path.join(coreMyAccountDir, subdir)

    if (!existsSync(source)) {
      continue
    }

    const dest = path.join(mergeDir, subdir)
    cpSync(source, dest, { recursive: true })
    dirs.push(dest)
  }

  return { mergeDir, dirs }
}

/**
 * Removes the temporary My Account merge directory. Safe to call on any
 * outcome (success, dry-run, or failure).
 */
export function cleanupMyAccountMergeDir(mergeDir: string): void {
  rmSync(mergeDir, { recursive: true, force: true })
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
