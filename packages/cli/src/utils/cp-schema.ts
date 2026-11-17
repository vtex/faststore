/**
 * CP (Content Platform) schema helpers for `cms-sync`.
 * Generates and uploads the store's custom CMS schema via `vtex content`.
 * Store context only: no `-l` / base.jsonc, no core merge.
 */
import chalk from 'chalk'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
} from 'node:fs'
import path from 'node:path'
import { withBasePath } from './directory'
import { logger } from './logger'
import { getPluginName, type Plugin } from './plugins'
import { runCommandSync } from './runCommandSync'

const CP_SCHEMA_SUBDIRS = ['components', 'pages'] as const

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
  // Relative to basePath: the toolbelt resolves -o against the cwd
  // (path.join(cwd, arg)), so an absolute path would be doubled into
  // <store>/<store>/cms/... and fail with ENOENT.
  return path.relative(
    basePath,
    path.join(withBasePath(basePath).userCMSDir, 'schema.json')
  )
}

export type CpMerge = {
  /** Absolute root directory holding the merged CP schema files. */
  mergeDir: string
  /**
   * Paths of the two merged directories, relative to `basePath` and ordered as
   * `[components, pages]`, so they can be passed positionally to
   * `generate-schema <componentsPath> <pagesPath>`.
   */
  dirs: string[]
}

/**
 * Removes the temporary CP schema merge directory. Safe to call on any
 * outcome (success, dry-run, or failure).
 */
export function cleanupCpMergeDir(mergeDir: string): void {
  rmSync(mergeDir, { recursive: true, force: true })
}

const getPluginCmsDir = (basePath: string, plugin: Plugin) =>
  withBasePath(basePath).getPackagePath(
    getPluginName(plugin),
    'cms',
    'faststore'
  )

/**
 * Whether any plugin ships CP schema files (`cms/faststore/components` and/or
 * `cms/faststore/pages`) in its package. Legacy `content-types.json` /
 * `sections.json` files are not CP schemas and are ignored here.
 */
export function hasPluginCpSchema(
  basePath: string,
  plugins: Plugin[]
): boolean {
  return plugins.some((plugin) =>
    CP_SCHEMA_SUBDIRS.some((subdir) =>
      existsSync(path.join(getPluginCmsDir(basePath, plugin), subdir))
    )
  )
}

/**
 * Stages the CP schema sources in two directories (`components`, `pages`) so
 * they can be passed positionally to `generate-schema`. File-level merge, in
 * increasing priority: core My Account (when enabled), each plugin in
 * `plugins` order, then the store's own customizations. A file from a later
 * source overwrites the same relative path from an earlier one; an overwrite
 * between two plugins is reported with a warning.
 *
 * Same staging rules as the My Account merge: the dir lives in `.faststore`
 * and returned paths are relative to `basePath`.
 */
export function prepareCpMergeDir({
  basePath,
  includeMyAccount,
  plugins,
}: {
  basePath: string
  includeMyAccount: boolean
  plugins: Plugin[]
}): CpMerge {
  const { coreCMSDir, userCMSDir, tmpDir } = withBasePath(basePath)
  const coreMyAccountDir = path.join(coreCMSDir, 'my-account')

  if (includeMyAccount && !existsSync(coreMyAccountDir)) {
    logger.error(
      `${chalk.red('[Error]')} - My Account is enabled but the core My Account schemas were not found at ${coreMyAccountDir}. Update @faststore/core or disable experimental.enableFaststoreMyAccount.`
    )
    process.exit(1)
  }

  mkdirSync(tmpDir, { recursive: true })
  const mergeDir = mkdtempSync(path.join(tmpDir, 'cms-merge-'))

  // Staged file -> plugin that provided it, to report plugin-vs-plugin overwrites.
  const pluginOwners = new Map<string, string>()

  const copyFrom = (source: string, dest: string, pluginName?: string) => {
    if (!existsSync(source)) return

    cpSync(source, dest, {
      recursive: true,
      filter: (src, destination) => {
        if (!pluginName || !statSync(src).isFile()) return true

        const previous = pluginOwners.get(destination)
        if (previous && previous !== pluginName) {
          logger.warn(
            `${chalk.yellow('[Warning]')} - ${path.relative(mergeDir, destination)} from ${pluginName} overrides the same file from ${previous}.`
          )
        }
        pluginOwners.set(destination, pluginName)
        return true
      },
    })
  }

  try {
    const dirs: string[] = []
    for (const subdir of CP_SCHEMA_SUBDIRS) {
      const dest = path.join(mergeDir, subdir)
      mkdirSync(dest, { recursive: true })

      if (includeMyAccount) {
        copyFrom(path.join(coreMyAccountDir, subdir), dest)
      }
      for (const plugin of plugins) {
        copyFrom(
          path.join(getPluginCmsDir(basePath, plugin), subdir),
          dest,
          getPluginName(plugin)
        )
      }
      copyFrom(path.join(userCMSDir, subdir), dest)

      dirs.push(path.relative(basePath, dest))
    }

    return { mergeDir, dirs }
  } catch (error) {
    cleanupCpMergeDir(mergeDir)
    throw error
  }
}

export function generateAndUploadSchema({
  basePath,
  dirs,
  schemaOut,
  dryRun,
  project,
}: {
  basePath: string
  dirs: string[]
  schemaOut: string
  dryRun: boolean
  /**
   * The store's `contentSource.project`, forwarded as `--storeId` to
   * `vtex content upload-schema` so the published schema's `$id`
   * (`${account}.${storeId}`) matches the project declared in
   * `discovery.config.js`, mirroring the legacy CMS flow's use of `project`
   * in `vtex cms sync ${project}`. Falls back to `'faststore'`, the same
   * default already used there.
   */
  project?: string
}): void {
  // Interactive: generate-schema prompts to confirm overriding base
  // definitions (no --yes flag), and upload-schema prompts for the schema
  // version to publish. stdio must reach the user's TTY.
  runCommandSync({
    cmd: `vtex content generate-schema ${dirs.join(' ')} -o ${schemaOut}`,
    cwd: basePath,
    throws: 'error',
    errorMessage: 'Failed to generate CMS schema',
    interactive: true,
  })

  if (dryRun) {
    return
  }

  const storeId = project ?? 'faststore'

  runCommandSync({
    cmd: `vtex content upload-schema ${schemaOut} --storeId ${storeId}`,
    cwd: basePath,
    throws: 'error',
    errorMessage: 'Failed to upload CMS schema',
    interactive: true,
  })
}
