import storeConfig from 'discovery.config'
import { addCustomPathPrefix, extractCustomPathPrefix } from './bindingPaths'

type RedirectLocaleContext = {
  locale?: string
  defaultLocale?: string
  /**
   * Present in `getServerSideProps` (absent in `getStaticProps`). Its `url`
   * keeps the original, pre-proxy-rewrite path — including custom binding
   * prefixes like `/europe/it` — which `resolvedUrl` does not.
   */
  req?: { url?: string }
}

/**
 * Localizes an internal redirect `destination` for `getServerSideProps` /
 * `getStaticProps`, mirroring the client-side `useLink.resolveLink` logic.
 *
 * Next.js (Pages Router) does NOT add the active locale to a
 * `redirect.destination`, so without this the redirect drops to the default
 * binding. Resolution order (same as `resolveLink`):
 *
 * 1. If the request is on a custom binding path (e.g. `/europe/it`, `/emea-eur`),
 *    preserve that prefix via `addCustomPathPrefix` — the `proxy.ts` rewrite maps
 *    the prefixed URL back to the right locale, keeping the user on the vanity path.
 * 2. Otherwise, if on a non-default Next locale, prepend `/${locale}`.
 * 3. Otherwise (default locale / subdomain binding), return as-is.
 *
 * The custom-path branch requires `context.req.url`; in `getStaticProps` (no
 * request) only the locale branch applies.
 */
export function localizeRedirectDestination(
  destination: string,
  context: RedirectLocaleContext
): string {
  if (!storeConfig.localization?.enabled) {
    return destination
  }

  // Only internal, absolute paths are localized (skip external URLs and
  // protocol-relative `//host` destinations).
  if (!destination.startsWith('/') || destination.startsWith('//')) {
    return destination
  }

  const requestUrl = context.req?.url ?? ''

  // 1. Custom binding path (e.g. `/europe/it`) — preserve it, matching resolveLink.
  if (extractCustomPathPrefix(requestUrl) !== null) {
    return addCustomPathPrefix(destination, requestUrl)
  }

  // 2. Non-default Next locale (e.g. `/it-IT`) — Next won't add it on redirects.
  const { locale, defaultLocale } = context

  if (!locale || !defaultLocale || locale === defaultLocale) {
    return destination
  }

  // Already prefixed (defensive — avoids `/it-IT/it-IT/...`).
  if (destination === `/${locale}` || destination.startsWith(`/${locale}/`)) {
    return destination
  }

  return `/${locale}${destination}`
}
