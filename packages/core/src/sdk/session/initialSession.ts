import type { Session } from '@faststore/sdk'

import storeConfig from '../../../discovery.config'
import { getSettings } from '../localization/settings'

/**
 * Parses a session.channel JSON string defensively. Returns `{}` on null,
 * undefined, empty, or malformed input.
 */
function safeParseChannel(
  value: string | null | undefined
): Record<string, unknown> {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Computes the initial session value by merging the URL-derived locale,
 * currency, and sales channel into the provided defaults.
 *
 * Without this, the session store initializes with the default locale from
 * discovery.config. The persisted middleware then hydrates from IDB (or
 * falls back to readInitial()) and triggers validateSession with that
 * default/stale locale. Only later, in a useEffect, does
 * useLocalizationConfig detect the URL locale and correct the session —
 * causing a second, redundant pair of validateSession + validateCart calls.
 *
 * By seeding the initial value with the URL locale we ensure readInitial()
 * already contains the correct locale (fixes first-visit). IDB payloads that
 * carry an outdated locale are corrected by `reconcileSessionLocale` (wired as
 * the `persisted` reconcile seam in `createSessionStore`).
 */
export function getInitialSession(
  defaults: Session = storeConfig.session
): Session {
  if (!storeConfig.localization?.enabled || typeof window === 'undefined') {
    return defaults
  }

  try {
    const settings = getSettings()
    const channel = JSON.parse(defaults.channel ?? '{}') ?? {}
    channel.salesChannel = settings.salesChannel

    return {
      ...defaults,
      locale: settings.locale,
      currency: settings.currency,
      channel: JSON.stringify(channel),
    }
  } catch {
    return defaults
  }
}

/**
 * Reconciles a session payload read from IDB (on hydration and on the
 * `focus`/`visibilitychange` cross-tab sync) with the URL-derived localization
 * settings, forcing `locale`/`currency`/`salesChannel` to follow the URL while
 * preserving every other field from the persisted payload.
 *
 * This is the SDK `persisted` reconcile seam (see `CreateStoreOptions`): the
 * URL is the single source of truth for localization, so neither a stale IDB
 * value nor a `validateSession` round-trip (which receives no locale hint in
 * `search` on path-based bindings) can flip the locale back to the default.
 *
 * When localization is disabled or there is no `window` (SSR), the payload is
 * returned untouched.
 */
export function reconcileSessionLocale(fromIDB: Session): Session {
  if (!storeConfig.localization?.enabled || typeof window === 'undefined') {
    return fromIDB
  }

  try {
    const settings = getSettings()
    const channel = safeParseChannel(fromIDB.channel)
    channel.salesChannel = settings.salesChannel

    return {
      ...fromIDB,
      locale: settings.locale,
      currency: settings.currency,
      channel: JSON.stringify(channel),
    }
  } catch {
    return fromIDB
  }
}
