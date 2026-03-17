import storeConfig from 'discovery.config'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import {
  addCustomPathPrefix,
  extractCustomPathPrefix,
  localeHasDomainBinding,
} from 'src/utils/localization/bindingPaths'

type ResolveHrefContext = {
  locale?: string
  asPath?: string
}

/**
 * Pure function used by tests and the `useLink` hook.
 */
export function resolveHref(
  href: string | undefined,
  context: ResolveHrefContext = {}
): string | undefined {
  if (href == null || href === '') {
    return undefined
  }

  // Absolute or protocol-relative URLs are left unchanged
  if (!href.startsWith('/') || href.startsWith('//')) {
    return href
  }

  const asPath = context.asPath ?? ''
  const withCustomPath = addCustomPathPrefix(href, asPath)
  const defaultLocale = storeConfig.localization?.defaultLocale

  const onCustomPath = extractCustomPathPrefix(asPath) !== null

  const { locale } = context
  const shouldConsiderLocale =
    storeConfig.localization?.enabled === true &&
    typeof locale === 'string' &&
    typeof defaultLocale === 'string' &&
    locale !== defaultLocale &&
    onCustomPath === false &&
    // Do not prefix when the locale has a domain-based binding (e.g. fr.brandless.fast.store)
    localeHasDomainBinding(locale) === false

  if (shouldConsiderLocale) {
    return `/${locale}${href}`
  }

  return withCustomPath
}

/**
 * Hook that centralizes link resolution with custom path prefix (i18n).
 * Use resolveLink(href) to get the href with the current locale's custom path applied when applicable.
 */
export function useLink() {
  const router = useRouter()

  const resolveLink = useCallback(
    (href: string | undefined): string | undefined =>
      resolveHref(href, {
        locale: router.locale ?? undefined,
        asPath: router.asPath ?? undefined,
      }),
    [router.asPath, router.locale]
  )

  return { resolveLink }
}
