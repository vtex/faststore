#!/usr/bin/env node
/**
 * Pre-build script to retrieve locale information from FastStore SDK.
 * It generates a JSON file consumed during Next.js build to configure i18n.
 */

// -- uncomment when running locally:
// const path = require('path')
// const fs = require('fs/promises')
// const dotenv = require('dotenv')
// dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { FastStoreSDK } = require('@vtex/faststore-sdk')
const storeConfig = require('../discovery.config')

const OUTPUT_DIR = path.resolve(__dirname, '../')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'locales.json')

const { VTEX_ACCOUNT, FS_DISCOVERY_APP_KEY, FS_DISCOVERY_APP_TOKEN } =
  process.env

const hasCredentials =
  VTEX_ACCOUNT && FS_DISCOVERY_APP_KEY && FS_DISCOVERY_APP_TOKEN

/**
 * Normalize locale strings returned by the SDK.
 * Converts underscores to hyphen and uppercases the region part when present.
 */
const normalizeLocale = (locale) => {
  if (!locale || typeof locale !== 'string') {
    return null
  }

  const trimmed = locale.trim()

  if (trimmed.length === 0) {
    return null
  }

  const [language, region] = trimmed.replace('_', '-').split('-')

  if (!language) {
    return null
  }

  if (!region) {
    return language.toLowerCase()
  }

  return `${language.toLowerCase()}-${region.toUpperCase()}`
}

const normalizeLocales = (locales = []) =>
  Array.from(new Set(locales.map(normalizeLocale).filter(Boolean)))

const normalizeUrls = (urls = {}) =>
  Object.entries(urls).reduce((acc, [rawLocale, url]) => {
    const locale = normalizeLocale(rawLocale)

    if (!locale || !url) {
      return acc
    }

    acc[locale] = url

    return acc
  }, {})

const getFallbackSettings = () => ({
  locales: normalizeLocales([storeConfig.session.locale]),
  defaultLocale: normalizeLocale(storeConfig.session.locale),
  urls: normalizeUrls({
    [storeConfig.session.locale]: storeConfig.storeUrl,
  }),
  currency: storeConfig.session.currency.code,
  salesChannel: JSON.parse(storeConfig.session.channel).salesChannel,
})

async function fetchLocalesFromSDK() {
  if (!hasCredentials) {
    console.warn(
      '[fetch-locales] Missing VTEX credentials. Falling back to discovery.config defaults.'
    )

    return getFallbackSettings()
  }

  const faststore = new FastStoreSDK({
    account: VTEX_ACCOUNT,
    appKey: FS_DISCOVERY_APP_KEY,
    appToken: FS_DISCOVERY_APP_TOKEN,
  })

  const baseUrl = storeConfig.storeUrl

  console.info(`[fetch-locales] Fetching settings for ${baseUrl}`)

  const response = await faststore.settings({ url: baseUrl })

  const locales = normalizeLocales(response.locales)
  const urls = normalizeUrls(response.urls)

  console.log('response', response)

  // TODO: Improve default locale selection
  // QUESTION: do we need current locale here?
  const defaultLocale = normalizeLocale(response.currentLocale) ?? locales[0]

  return {
    locales: locales.length > 0 ? locales : getFallbackSettings().locales,
    defaultLocale,
    urls,
    currency: response.currency,
    salesChannel: response.salesChannel,
    raw: response,
  }
}

async function writeOutput(data) {
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2))

  console.info(`[fetch-locales] Locale data saved to ${OUTPUT_FILE}`)
}

async function main() {
  try {
    const data = await fetchLocalesFromSDK()

    await writeOutput(data)
  } catch (error) {
    console.error('[fetch-locales] Failed to fetch locales:', error)

    const fallback = getFallbackSettings()

    await writeOutput({
      ...fallback,
      raw: null,
      error: true,
    })

    process.exitCode = 1
  }
}

main()
