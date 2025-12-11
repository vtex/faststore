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
// import { FastStoreSDK } from '@vtex/faststore-sdk'
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

    // TODO: Uncomment when SDK is updated to return new structure
    // const faststore = new FastStoreSDK({
    //   account: VTEX_ACCOUNT,
    //   appKey: FS_DISCOVERY_APP_KEY,
    //   appToken: FS_DISCOVERY_APP_TOKEN,
    // })

    // const settings = await faststore.settings()

    saveConfigFile(
      await format(
        `module.exports = ${JSON.stringify(
          {
            ...(discoveryConfig?.default ?? discoveryConfig),
            i18n: mockedSettings,
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

export const mockedSettings = {
  defaultLocale: 'pt-BR',
  regions: {
    BR: {
      code: 'BR',
      name: 'Brazil',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      timeFormatMask: 'hh:mm a',
      unitSystem: 'metric',
      defaultTimezone: 'GMT-3',
    },
    CA: {
      code: 'CA',
      name: 'Canada',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '12h',
      timeFormatMask: 'hh:mm a',
      unitSystem: 'metric',
      defaultTimezone: 'GMT-5',
    },
    US: {
      code: 'US',
      name: 'United States',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      timeFormatMask: 'hh:mm a',
      unitSystem: 'imperial',
      defaultTimezone: 'GMT-5',
    },
  },
  locales: {
    'pt-BR': {
      code: 'pt-BR',
      name: 'Português',
      languageCode: 'pt',
      languageName: 'Portuguese',
      script: 'Latn',
      textDirection: 'ltr',
      regionCode: 'BR',
      bindings: [
        {
          currencyCode: 'BRL',
          url: 'https://brandless.fast.store/pt-BR',
          salesChannel: '1',
          isDefault: true,
        },
        {
          currencyCode: 'BRL',
          url: 'https://pt.brandless.fast.store',
          salesChannel: '2',
          isDefault: false,
        },
      ],
    },
    'it-IT': {
      code: 'it-IT',
      name: 'Italiano',
      languageCode: 'it',
      languageName: 'Italian',
      script: 'Latn',
      textDirection: 'ltr',
      regionCode: 'IT',
      bindings: [
        {
          currencyCode: 'EUR',
          url: 'https://brandless.fast.store/it-IT',
          salesChannel: '3',
          isDefault: false,
        },
      ],
    },
    'en-CA': {
      code: 'en-CA',
      name: 'English (Canada)',
      languageCode: 'en',
      languageName: 'English',
      script: 'Latn',
      textDirection: 'ltr',
      regionCode: 'CA',
      bindings: [
        {
          currencyCode: 'USD',
          url: 'https://brandless.fast.store/en-CA',
          salesChannel: '2',
          isDefault: false,
        },
      ],
    },
    'fr-CA': {
      code: 'fr-CA',
      name: 'Français',
      languageCode: 'fr',
      languageName: 'French',
      script: 'Latn',
      textDirection: 'ltr',
      regionCode: 'CA',
      bindings: [
        {
          currencyCode: 'USD',
          url: 'https://brandless.fast.store/fr-CA',
          salesChannel: '2',
          isDefault: false,
        },
      ],
    },
    'en-US': {
      code: 'en-US',
      name: 'English',
      languageCode: 'en',
      languageName: 'English',
      script: 'Latn',
      textDirection: 'ltr',
      regionCode: 'US',
      bindings: [
        {
          currencyCode: 'USD',
          url: 'https://brandless.fast.store/en-US',
          salesChannel: '2',
          isDefault: false,
        },
      ],
    },
  },
  currencies: {
    BRL: {
      code: 'BRL',
      name: 'Brazilian Real',
      symbol: 'R$',
    },
    USD: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    },
    EUR: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
    },
  },
}
