import type { Session, Store } from '@faststore/sdk'
import deepEqual from 'fast-deep-equal'

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
 * By seeding the initial value with the URL locale we ensure:
 * 1. readInitial() already contains the correct locale (fixes first-visit).
 * 2. The correction subscriber below can fix IDB payloads that carry an
 *    outdated locale without an extra round-trip.
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
 * Installs a one-shot subscriber that corrects the locale/currency/channel
 * when the persisted middleware hydrates a session from IDB whose values
 * differ from the URL-derived initial session.
 *
 * Why this works:
 * - It must be subscribed AFTER `optimistic`, so it fires within the same
 *   synchronous `store.set()` call that enqueues `validateSession(stale)`.
 * - It then calls `store.set(corrected)`, re-entering the base store's set().
 *   The base store invokes `cancelations.forEach(cancel)` which flips the
 *   `cancel` flag of the just-enqueued optimistic handler — preventing the
 *   stale `validateSession` from ever hitting the network — and broadcasts
 *   again, enqueueing a new optimistic handler with the corrected value.
 *
 * The `corrected` flag guarantees the subscriber runs at most once: subsequent
 * locale changes (e.g. from `LocalizationSelector`) must not be intercepted.
 *
 * @returns Unsubscribe function (mainly useful in tests).
 */
export function installLocaleCorrector(
  store: Store<Session>,
  initialSession: Session
): () => void {
  let corrected = false

  return store.subscribe((session: Session) => {
    if (corrected) return
    corrected = true

    if (
      session.locale === initialSession.locale &&
      deepEqual(session.currency, initialSession.currency) &&
      session.channel === initialSession.channel
    ) {
      return
    }

    const channel = safeParseChannel(session.channel)
    channel.salesChannel = safeParseChannel(initialSession.channel).salesChannel

    store.set({
      ...session,
      locale: initialSession.locale,
      currency: initialSession.currency,
      channel: JSON.stringify(channel),
    })
  })
}
