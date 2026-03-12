import { Args, Command, Flags } from '@oclif/core'
import { FastStoreSDK } from '@vtex/faststore-sdk'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fsExtra from 'fs-extra'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { format } from 'prettier'
import { checkAndValidateLocalization } from '../utils/config'
import { getBasePath, withBasePath } from '../utils/directory'
import { saveFile } from '../utils/file'
import { logger } from '../utils/logger'

const configFileName = 'discovery.config.default.js'

export default class GenerateI18n extends Command {
  static hidden = true

  static flags = {
    config: Flags.string({
      name: 'config',
      description: 'The path where the discovery.config is located',
    }),
  }

  static args = {
    path: Args.string({
      name: 'path',
      description:
        'The path where the FastStore being built is. Defaults to cwd.',
    }),
  }

  getConfigFile(rootPath?: string) {
    return this.getFile(configFileName, [configFileName])(rootPath)
  }

  getFile(fileName: string, pathFromRoot?: string | Array<string>) {
    return (rootPath?: string) => {
      switch (true) {
        case !rootPath:
          return
        case rootPath?.endsWith(fileName) && fsExtra.existsSync(rootPath):
          return rootPath
        case fsExtra.existsSync(path.join(rootPath ?? '', fileName)):
          return path.join(rootPath, fileName)
        default:
          if (!pathFromRoot) return

          const filePath = path.join(
            rootPath,
            ...(Array.isArray(pathFromRoot) ? pathFromRoot : [pathFromRoot])
          )

          if (fsExtra.existsSync(filePath)) {
            return filePath
          }
          return
      }
    }
  }

  errorFileNotFound(fileName: string, rootDir: string) {
    logger.error(
      `${chalk.red('[Error]')} - Couldn't find ${fileName} at ${rootDir}`
    )

    process.exit(1)
  }

  async run() {
    const { args, flags } = await this.parse(GenerateI18n)
    const rootPath = getBasePath()
    const argPath =
      (args?.path && path.resolve(rootPath, args.path)) || rootPath

    // Check if localization is enabled and contentSource is set to CP
    const localizationEnabled = await checkAndValidateLocalization(argPath)

    if (!localizationEnabled) {
      return
    }

    const vtexEnvPath = path.join(argPath, 'vtex.env')
    if (existsSync(vtexEnvPath)) {
      dotenv.config({ path: vtexEnvPath })
    }

    const { VTEX_ACCOUNT, FS_DISCOVERY_APP_KEY, FS_DISCOVERY_APP_TOKEN } =
      process.env
    const hasCredentials =
      VTEX_ACCOUNT && FS_DISCOVERY_APP_KEY && FS_DISCOVERY_APP_TOKEN

    if (!hasCredentials) {
      logger.error(`${chalk.red('[Error]')} - Missing VTEX credentials.\n
      ${chalk.cyan('Required Action:')}\n
      Check your FastStore WebOps Settings page - to work in production, it should contain the following variables: ${chalk.cyan('VTEX_ACCOUNT')}, ${chalk.cyan('FS_DISCOVERY_APP_KEY')}, ${chalk.cyan('FS_DISCOVERY_APP_TOKEN')}.\n
      If running locally, please check your ${chalk.bold('vtex.env')} file, it should also contain those variables.
      `)

      process.exit(1)
    }

    const { tmpDir } = withBasePath(argPath)
    const configPath =
      this.getConfigFile(flags.config && path.resolve(argPath, flags.config)) ||
      this.getConfigFile(tmpDir) ||
      this.getConfigFile(argPath)

    if (!configPath) {
      return this.errorFileNotFound(
        configFileName,
        `\n    ${tmpDir}\n    ${argPath}`
      )
    }

    const saveConfigFile = saveFile(configPath)

    if (fsExtra.pathExistsSync(tmpDir))
      logger.info(`${chalk.blue('[Info]')} - .faststore Path at: ${tmpDir}`)

    logger.info(`${chalk.blue('[Info]')} - Config file location: ${configPath}`)
    const discoveryConfig = await import(configPath)

    const faststore = new FastStoreSDK({
      account: VTEX_ACCOUNT,
      appKey: FS_DISCOVERY_APP_KEY,
      appToken: FS_DISCOVERY_APP_TOKEN,
    })

    const settings = await faststore.locales()
    const currentConfig = discoveryConfig?.default ?? discoveryConfig

    saveConfigFile(
      await format(
        `module.exports = ${JSON.stringify(
          {
            ...currentConfig,
            localization: {
              ...(currentConfig?.localization ?? {}),
              ...settings,
            },
          },
          undefined,
          2
        )}`,
        {
          parser: 'typescript',
          quoteProps: 'as-needed',
        }
      )
    )

    logger.info(
      `${chalk.green('success')} - i18n configuration successfully generated 🎉`
    )
  }
}
