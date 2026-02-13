export type LocalesSettings = {
  defaultLocale: string
  regions?: Record<
    string,
    {
      code: string
      name: string
      dateFormat: string
      timeFormat: string
      timeFormatMask: string
      unitSystem: string
      defaultTimezone: string
    }
  >
  locales: Record<
    string,
    {
      code: string
      name: string
      languageCode: string
      languageName: string
      script: string
      textDirection: string
      regionCode: string
      bindings: Array<{
        currencyCode: string
        url: string
        salesChannel: string
        isDefault: boolean
      }>
    }
  >
  currencies?: Record<
    string,
    {
      code: string
      name: string
      symbol: string
    }
  >
}
