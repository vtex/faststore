import dotenv from 'dotenv'
dotenv.config({
  path: [path.resolve(process.cwd(), '.env')],
})
import { format } from 'prettier'
import path from 'node:path'
import { getBasePath, withBasePath } from '../utils/directory'
import { Args, Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { logger } from '../utils/logger'
import { FastStoreSDK } from '@vtex/faststore-sdk'
import fsExtra from 'fs-extra'
import { saveFile } from '../utils/file'

const configFileName = 'discovery.config.default.js'

const { VTEX_ACCOUNT, FS_DISCOVERY_APP_KEY, FS_DISCOVERY_APP_TOKEN } =
  process.env

const hasCredentials =
  VTEX_ACCOUNT && FS_DISCOVERY_APP_KEY && FS_DISCOVERY_APP_TOKEN

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

    if (!hasCredentials) {
      logger.info(`${chalk.red('error')} - Missing VTEX credentials.`)

      return
    }

    const faststore = new FastStoreSDK({
      account: VTEX_ACCOUNT,
      appKey: FS_DISCOVERY_APP_KEY,
      appToken: FS_DISCOVERY_APP_TOKEN,
    })

    const settings = await faststore.locales()
    const currentConfig = discoveryConfig?.default ?? discoveryConfig

    // Validate contentSource configuration for localization
    const shouldUseCP = currentConfig.localization.enabled
    const currentContentSourceType =
      currentConfig?.contentSource?.type?.toUpperCase()

    if (shouldUseCP && currentContentSourceType !== 'CP') {
      logger.error(
        `\n${chalk.yellow('[Error]')} - Localization is enabled but contentSource is set to "${currentContentSourceType}".\n\n` +
          `${chalk.cyan('Required Action:')}\n` +
          `Update your ${chalk.bold('discovery.config.js')} file:\n\n` +
          `  contentSource: {\n` +
          `    type: ${chalk.green('"CP"')}\n` +
          `  },\n\n` +
          `${chalk.dim('When localization is enabled, Content Platform (CP) is required.')}\n`
      )

      process.exit(1)
    }

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
