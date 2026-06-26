/**
 * CP (Content Platform) schema helpers for `cms-sync`.
 * Generates and uploads the store's custom CMS schema via `vtex content`.
 * Store context only: no `-l` / base.jsonc, no core merge.
 */
import chalk from 'chalk'
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
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
  /** Absolute root directory holding the merged My Account JSONC. */
  mergeDir: string
  /**
   * Paths of the two merged directories, relative to `basePath` and ordered as
   * `[components, pages]`, so they can be passed positionally to
   * `generate-schema <componentsPath> <pagesPath>`.
   */
  dirs: string[]
}

/**
 * Builds a staging directory with exactly two subdirectories (`components` and
 * `pages`), each holding the file-level merge of the core My Account CMS JSONC
 * and the store's own customizations, ready to be fed to
 * `generate-schema <componentsPath> <pagesPath>`.
 *
 * `generate-schema` accepts exactly two positional directory arguments, so the
 * merge has to happen at the file level (not by passing extra directories).
 * Core My Account files are copied first and the store's files are copied on
 * top, so a store that customizes a My Account file keeps its own version.
 *
 * The staging dir lives inside the store's `.faststore` tmp folder (created on
 * demand) and the returned paths are relative to `basePath`. The toolbelt
 * resolves positional args against the cwd (`path.join(cwd, arg)`), so an
 * absolute path under `os.tmpdir()` would be mangled into `<store>/var/...`
 * and fail with ENOENT.
 *
 * The My Account schemas are intentionally excluded from the published base
 * schema (and the Schema Registry), so they must be supplied locally when the
 * `experimental.enableFaststoreMyAccount` flag is on. They are copied from the
 * installed `@faststore/core`.
 *
 * Exits the process when the core My Account schemas are not found.
 */
export function prepareMyAccountMergeDir(basePath: string): MyAccountMerge {
  const { coreCMSDir, userCMSDir, tmpDir } = withBasePath(basePath)
  const coreMyAccountDir = path.join(coreCMSDir, 'my-account')

  if (!existsSync(coreMyAccountDir)) {
    logger.error(
      `${chalk.red('[Error]')} - My Account is enabled but the core My Account schemas were not found at ${coreMyAccountDir}. Update @faststore/core or disable experimental.enableFaststoreMyAccount.`
    )
    process.exit(1)
  }

  // `.faststore` may not exist yet in the CP flow (it does not run `generate`).
  mkdirSync(tmpDir, { recursive: true })
  const mergeDir = mkdtempSync(path.join(tmpDir, 'cms-myaccount-'))

  const dirs: string[] = []
  for (const subdir of MY_ACCOUNT_SUBDIRS) {
    const dest = path.join(mergeDir, subdir)
    mkdirSync(dest, { recursive: true })

    // Core My Account first; the store's customizations override on collision.
    const coreSource = path.join(coreMyAccountDir, subdir)
    if (existsSync(coreSource)) {
      cpSync(coreSource, dest, { recursive: true })
    }

    const storeSource = path.join(userCMSDir, subdir)
    if (existsSync(storeSource)) {
      cpSync(storeSource, dest, { recursive: true })
    }

    dirs.push(path.relative(basePath, dest))
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
