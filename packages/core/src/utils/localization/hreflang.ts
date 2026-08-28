import storeConfig from 'discovery.config'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'

export type LocaleSlug = { locale: string; slug: string }

export type HreflangLink = { hrefLang: string; href: string }

/**
 * Builds the hreflang cluster for a page the catalog resolves in more than one
 * locale.
 *
 * `otherLocales` must include the locale being rendered: a cluster that does not
 * reference itself is ignored by search engines. The resolver guarantees this
 * for the current locale and omits any locale whose slug the catalog does not
 * resolve, so an advertised alternate always points at a real page.
 *
 * Feed the result to NextSeo's `languageAlternates`, not `additionalLinkTags`:
 * the latter keys tags by href, so the default locale and `x-default` share a
 * key and Next drops one of them.
 *
 * @param otherLocales - Slug registered for each locale that resolves this page
 * @param urlSuffix - Appended after the slug: '/p' for products, '' for collections
 */
export function buildHreflangLinks(
  otherLocales: LocaleSlug[] | null | undefined,
  urlSuffix = ''
): HreflangLink[] {
  if (!storeConfig.localization?.enabled || !otherLocales?.length) return []

  const links: HreflangLink[] = otherLocales.map(({ locale, slug }) => ({
    hrefLang: locale,
    href: `${getStoreURL(locale).replace(/\/$/, '')}/${slug}${urlSuffix}`,
  }))

  // x-default is what a shopper gets when no advertised locale matches, so it
  // has to be a URL that is canonical in its own right. That is the default
  // locale's binding, not the store root: a store whose default locale is served
  // under a prefix or its own domain answers at the root too, but that root URL
  // canonicalizes elsewhere and would send the cluster to a page that disclaims
  // itself.
  const defaultLocale = storeConfig.localization.defaultLocale
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
