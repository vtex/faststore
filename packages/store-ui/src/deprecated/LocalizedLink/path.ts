export const localeFromPath = (pathname: string) => {
  const [, base] = pathname.split(`/`)

  return base
}

export const localizedPath = (
  defaultLocale: string,
  locale: string,
  path: string
) => {
  // The default language isn't prefixed
  if (locale === defaultLocale) {
    return path
  }

  const base = localeFromPath(path)

  // If for whatever reason we receive an already localized path
  // (e.g. if the path was made with location.pathname)
  // just return it as-is.
  if (base === locale) {
    return path
  }

  // If it's another language, prefix with the locale
  return `/${locale}${path}`
}
