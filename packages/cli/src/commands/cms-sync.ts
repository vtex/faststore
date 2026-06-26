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
  cleanupMyAccountMergeDir,
  errorNoCustomization,
  generateAndUploadSchema,
  getCpSchemaOutputPath,
  getExistingCpDirs,
  type MyAccountMerge,
  prepareMyAccountMergeDir,
} from '../utils/cp-schema'
import { getBasePath, withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'
import { mergeCMSFiles } from '../utils/hcms'
import { logger } from '../utils/logger'
import { assertVtexReadyForAccount } from '../utils/vtex'

type StoreConfig = {
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

    const dirs = getExistingCpDirs(basePath)

    let merge: MyAccountMerge | undefined
    if (isMyAccountEnabled(storeConfig)) {
      logger.info(
        `${chalk.blue('[Info]')} - Merging My Account sections and content-types into the schema`
      )
      merge = prepareMyAccountMergeDir(basePath)
      dirs.push(...merge.dirs)
    }

    if (dirs.length === 0) {
      errorNoCustomization()
    }

    const schemaOut = getCpSchemaOutputPath(basePath)

    try {
      generateAndUploadSchema({
        basePath,
        dirs,
        schemaOut,
        dryRun: dryRun ?? false,
      })
    } finally {
      if (merge) {
        cleanupMyAccountMergeDir(merge.mergeDir)
      }
    }
  }
}
