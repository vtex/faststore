import storeConfig from 'discovery.config'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

type LocaleContext = Pick<GetServerSidePropsContext, 'locale' | 'defaultLocale'>

/**
 * Next.js supports `redirect.locale` for i18n GSSP redirects at runtime.
 * The public `Redirect` type omits this field.
 */
type RedirectWithI18nLocale = {
  destination: string
  permanent?: boolean
  statusCode?: 301 | 302 | 303 | 307 | 308
  basePath?: false
  locale?: string | false
}

function isInternalPath(destination: string): boolean {
  return destination.startsWith('/') && !destination.startsWith('//')
}

/**
 * Adds `redirect.locale` for internal redirects when the active locale differs
 * from defaultLocale. Next.js i18n uses this to preserve the locale prefix
 * (e.g. /pt-BR/pvt/...) — do not prefix the destination path manually.
 */
export function localizeRedirectResult<P extends Record<string, unknown>>(
  context: LocaleContext,
  result: GetServerSidePropsResult<P>
): GetServerSidePropsResult<P> {
  if (!('redirect' in result) || !result.redirect) {
    return result
  }

  const redirect = result.redirect as RedirectWithI18nLocale
  const { destination, locale: redirectLocale } = redirect

  if (
    !isInternalPath(destination) ||
    redirectLocale !== undefined ||
    !context.locale
  ) {
    return result
  }

  const defaultLocale =
    context.defaultLocale ?? storeConfig.localization?.defaultLocale

  if (!defaultLocale || context.locale === defaultLocale) {
    return result
  }

  return {
    redirect: {
      ...redirect,
      locale: context.locale,
    },
  } as GetServerSidePropsResult<P>
}
