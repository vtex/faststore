import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { format } from 'prettier'
import { saveFile } from '../utils/file'

const mockedSettings = {
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

const faststoreSDKMock = vi.hoisted(() => ({
  FastStoreSDK: vi.fn().mockImplementation(() => ({
    locales: vi.fn().mockResolvedValue(mockedSettings),
  })),
}))

vi.mock('@vtex/faststore-sdk', () => faststoreSDKMock)

describe('GenerateI18n', () => {
  let tempDir: string
  let originalEnv: NodeJS.ProcessEnv
  let originalCwd: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-test-'))
    originalCwd = process.cwd()
    process.chdir(tempDir)

    originalEnv = { ...process.env }
    process.env.VTEX_ACCOUNT = 'testaccount'
    process.env.FS_DISCOVERY_APP_KEY = 'testkey'
    process.env.FS_DISCOVERY_APP_TOKEN = 'testtoken'

    vi.clearAllMocks()
  })

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
    process.chdir(originalCwd)
    process.env = originalEnv
  })

  it('should write i18n config to discovery.config.default.js file', async () => {
    const configPath = path.join(tempDir, 'discovery.config.default.js')
    const existingConfig = {
      seo: { title: 'Test Store' },
      api: { storeId: 'test' },
    }

    fs.writeFileSync(
      configPath,
      `module.exports = ${JSON.stringify(existingConfig, null, 2)}`
    )

    const discoveryConfig = await import(configPath)
    const currentConfig = discoveryConfig?.default ?? discoveryConfig
    const mergedConfig = {
      ...currentConfig,
      localization: {
        enabled: currentConfig?.localization?.enabled ?? true,
        ...mockedSettings,
      },
    }

    const saveConfigFile = saveFile(configPath)
    const formattedContent = await format(
      `module.exports = ${JSON.stringify(mergedConfig, undefined, 2)}`,
      {
        parser: 'typescript',
        quoteProps: 'as-needed',
      }
    )

    saveConfigFile(formattedContent)

    expect(fs.existsSync(configPath)).toBe(true)

    delete require.cache[require.resolve(configPath)]
    const config = require(configPath)

    expect(config.seo).toEqual(existingConfig.seo)
    expect(config.api).toEqual(existingConfig.api)

    expect(config.localization).toBeDefined()
    expect(config.localization.enabled).toBe(true)
    expect(config.localization.defaultLocale).toBe(mockedSettings.defaultLocale)
    expect(config.localization.regions).toEqual(mockedSettings.regions)
    expect(config.localization.locales).toEqual(mockedSettings.locales)
    expect(config.localization.currencies).toEqual(mockedSettings.currencies)
  })

  it('should merge i18n config preserving all existing properties', async () => {
    const configPath = path.join(tempDir, 'discovery.config.default.js')
    const existingConfig = {
      seo: { title: 'My Store', description: 'My Description' },
      api: { storeId: 'mystore', workspace: 'master' },
      theme: 'my-theme',
      platform: 'vtex',
      session: { locale: 'en-US', currency: { code: 'USD' } },
    }

    fs.writeFileSync(
      configPath,
      `module.exports = ${JSON.stringify(existingConfig, null, 2)}`
    )

    const discoveryConfig = await import(configPath)
    const currentConfig = discoveryConfig?.default ?? discoveryConfig
    const mergedConfig = {
      ...currentConfig,
      localization: {
        enabled: currentConfig?.localization?.enabled ?? true,
        ...mockedSettings,
      },
    }

    const saveConfigFile = saveFile(configPath)
    const formattedContent = await format(
      `module.exports = ${JSON.stringify(mergedConfig, undefined, 2)}`,
      {
        parser: 'typescript',
        quoteProps: 'as-needed',
      }
    )
    saveConfigFile(formattedContent)

    delete require.cache[require.resolve(configPath)]
    const config = require(configPath)

    expect(config.seo).toEqual(existingConfig.seo)
    expect(config.api).toEqual(existingConfig.api)
    expect(config.theme).toBe(existingConfig.theme)
    expect(config.platform).toBe(existingConfig.platform)
    expect(config.session).toEqual(existingConfig.session)

    expect(config.localization).toBeDefined()
    expect(config.localization.enabled).toBe(true)
    expect(config.localization.defaultLocale).toBe(mockedSettings.defaultLocale)
  })
})
