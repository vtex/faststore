import storeConfig from 'discovery.config'
import { getSettingsForLocale } from 'src/sdk/localization/settings'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'

export type LocaleSlug = { locale: string; slug: string }

export type HreflangLink = { hrefLang: string; href: string }

/**
 * Builds the hreflang cluster for a page the catalog resolves in more than one
 * locale.
 *
 * `otherLocales` carries registered translations only, so a page reached through
 * a locale that never registered a slug for it is missing from its own cluster.
 * Search engines ignore a set that does not reference itself, which would make
 * those annotations inert while still being reported as errors, so the cluster
 * is dropped entirely rather than published without a self-reference.
 *
 * Feed the result to NextSeo's `languageAlternates`, not `additionalLinkTags`:
 * the latter keys tags by href, so the default locale and `x-default` share a
 * key and Next drops one of them.
 *
 * @param otherLocales - Slug registered for each locale that resolves this page
 * @param currentLocale - Locale being rendered. Next leaves it undefined only
 *   when i18n is off, which means a single locale: the default one
 * @param urlSuffix - Appended after the slug: '/p' for products, '' for collections
 */
export function buildHreflangLinks(
  otherLocales: LocaleSlug[] | null | undefined,
  currentLocale: string | undefined,
  urlSuffix = ''
): HreflangLink[] {
  if (!storeConfig.localization?.enabled || !otherLocales?.length) return []

  const defaultLocale = storeConfig.localization.defaultLocale
  const renderedLocale = currentLocale ?? defaultLocale

  if (!otherLocales.some(({ locale }) => locale === renderedLocale)) return []

  const links: HreflangLink[] = otherLocales
    .filter(({ locale }) => {
      const settings = getSettingsForLocale(locale)
      if (!settings) {
        console.warn(
          `[hreflang] locale "${locale}" has no usable binding in discoveryConfig — skipped`
        )
      }
      return settings !== null
    })
    .map(({ locale, slug }) => ({
      hrefLang: locale,
      href: `${getStoreURL(locale).replace(/\/$/, '')}/${slug}${urlSuffix}`,
    }))

  // x-default is what a shopper gets when no advertised locale matches, so it
  // has to be a URL that is canonical in its own right. That is the default
  // locale's binding, not the store root: a store whose default locale is served
  // under a prefix or its own domain answers at the root too, but that root URL
  // canonicalizes elsewhere and would send the cluster to a page that disclaims
  // itself.
  const defaultEntry = otherLocales.find(
    ({ locale }) => locale === defaultLocale
  )

  if (defaultEntry) {
    links.push({
      hrefLang: 'x-default',
      href: `${getStoreURL(defaultLocale).replace(/\/$/, '')}/${defaultEntry.slug}${urlSuffix}`,
    })
  }

  return links
}
