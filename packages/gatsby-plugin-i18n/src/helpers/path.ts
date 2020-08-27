function isDefaultLang(locale: string, defaultLocale: string) {
  return locale === defaultLocale
}

export function localizedPath(
  defaultLocale: string,
  locale: string,
  path: string
) {
  // The default language isn't prefixed
  if (isDefaultLang(locale, defaultLocale)) {
    return path
  }

  const [, base] = path.split(`/`)

  // If for whatever reason we receive an already localized path
  // (e.g. if the path was made with location.pathname)
  // just return it as-is.
  if (base === locale) {
    return path
  }

  // If it's another language, prefix with the locale
  return `/${locale}${path}`
}
