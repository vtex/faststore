import { Args, Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  isMyAccountEnabled,
  resolveContentSource,
  type ResolvedContentSource,
} from '../utils/config'
import {
  type CpMerge,
  cleanupCpMergeDir,
  errorNoCustomization,
  generateAndUploadSchema,
  getCpSchemaOutputPath,
  getExistingCpDirs,
  hasPluginCpSchema,
  prepareCpMergeDir,
} from '../utils/cp-schema'
import { getBasePath, withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { mergeCMSFiles } from '../utils/hcms'
import { logger } from '../utils/logger'
import type { Plugin } from '../utils/plugins'
import { assertVtexReadyForAccount } from '../utils/vtex'

type StoreConfig = {
  plugins?: Plugin[]
  api?: {
    storeId?: string
  }
  contentSource?: {
    type?: string
    project?: string
  }
  experimental?: {
    enableFaststoreMyAccount?: boolean
  }
}

const CONTENT_SOURCE_ACTION: Record<ResolvedContentSource, string> = {
  CMS: 'merging and syncing CMS content',
  CP: 'generating and uploading schema',
}

export default class CmsSync extends Command {
  static flags = {
    ['dry-run']: Flags.boolean({ char: 'd' }),
  }

  static args = {
    path: Args.string({
      name: 'path',
      description:
        'The path where the FastStore being synched with the CMS is. Defaults to cwd.',
    }),
  }

  async run() {
    const { flags, args } = await this.parse(CmsSync)

    const basePath = getBasePath(args.path)
    const { userStoreConfigFile } = withBasePath(basePath)

    const storeConfig: StoreConfig | null = existsSync(userStoreConfigFile)
      ? (await import(pathToFileURL(path.resolve(userStoreConfigFile)).href))
          .default
      : null

    const source = resolveContentSource(storeConfig?.contentSource?.type)

    logger.info(
      `${chalk.blue('[Info]')} - Detected contentSource "${source}" — ${CONTENT_SOURCE_ACTION[source]}`
    )

    switch (source) {
      case 'CMS':
        return this.runLegacySync({
          basePath,
          storeConfig,
          dryRun: flags['dry-run'],
        })
      case 'CP':
        return this.runCpSync({
          basePath,
          storeConfig,
          dryRun: flags['dry-run'],
        })
      default: {
        return source
      }
    }
  }

  private async runLegacySync({
    basePath,
    storeConfig,
    dryRun,
  }: {
    basePath: string
    storeConfig: StoreConfig | null
    dryRun?: boolean
  }) {
    const { tmpDir } = withBasePath(basePath)
    const project = storeConfig?.contentSource?.project ?? 'faststore'

    await generate({ setup: true, basePath })
    await mergeCMSFiles(basePath)

    if (dryRun) {
      return
    }

    return spawn(`vtex cms sync ${project}`, {
      shell: true,
      cwd: tmpDir,
      stdio: 'inherit',
    })
  }

  private runCpSync({
    basePath,
    storeConfig,
    dryRun,
  }: {
    basePath: string
    storeConfig: StoreConfig | null
    dryRun?: boolean
  }) {
    assertVtexReadyForAccount(storeConfig?.api?.storeId)

    const includeMyAccount = isMyAccountEnabled(storeConfig)
    const plugins = storeConfig?.plugins ?? []
    const includePlugins = hasPluginCpSchema(basePath, plugins)

    let merge: CpMerge | undefined

    if (includeMyAccount || includePlugins) {
      if (includeMyAccount) {
        logger.info(
          `${chalk.blue('[Info]')} - Merging My Account sections and content-types into the schema`
        )
      }
      if (includePlugins) {
        logger.info(
          `${chalk.blue('[Info]')} - Merging plugin CMS schemas into the schema`
        )
      }
      // The merge dir already contains the store's own customizations merged
      // with the core My Account and plugin schemas, so it replaces the raw
      // store dirs.
      merge = prepareCpMergeDir({ basePath, includeMyAccount, plugins })
    }

    const dirs = merge ? merge.dirs : getExistingCpDirs(basePath)

    if (dirs.length === 0) {
      errorNoCustomization()
    }

    const schemaOut = getCpSchemaOutputPath(basePath)

    // A toolbelt failure inside generateAndUploadSchema exits via process.exit(),
    // which bypasses `finally`. Register the cleanup on `exit` so the staging dir
    // is removed on that path too, then run it synchronously and drop the hook on
    // every normal path (success, dry-run, or a thrown error).
    let cleanup: (() => void) | undefined
    if (merge) {
      const { mergeDir } = merge
      cleanup = () => cleanupCpMergeDir(mergeDir)
      process.once('exit', cleanup)
    }

    try {
      generateAndUploadSchema({
        basePath,
        dirs,
        schemaOut,
        dryRun: dryRun ?? false,
        project: storeConfig?.contentSource?.project,
      })
    } finally {
      if (cleanup) {
        process.removeListener('exit', cleanup)
        cleanup()
      }
    }
  }
}
