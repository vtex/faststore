import type { GraphqlContext } from '..'

export const isLocalizationEnabled = (ctx: GraphqlContext): boolean =>
  (ctx.discoveryConfig as { localization?: { enabled?: boolean } } | undefined)
    ?.localization?.enabled === true

/**
 * Locale to forward to Catalog by-linkid endpoints via the Accept-Language
 * header so they return localized name/title/description. Returns the active
 * locale only when localization is enabled; otherwise `undefined`, so
 * non-localized stores send no header and falls back to the store's default
 * registered language (legacy behavior).
 *
 * Read at request time (not client construction) because `ctx.discoveryConfig`
 * is attached after the clients are built and `ctx.storage.locale` is mutated
 * later by the collection resolver.
 */
export const getCatalogLocale = (ctx: GraphqlContext): string | undefined =>
  isLocalizationEnabled(ctx) ? ctx.storage.locale || undefined : undefined
