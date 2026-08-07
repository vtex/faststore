import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useSearch } from '@faststore/sdk'

const SCROLL_STORAGE_PREFIX = '__fs_scroll_'
const PENDING_RESTORE_FLAG = '__fs_scroll_pending_restore'
const RESTORING_SCROLL_CLASS = 'fs-restoring-scroll'
const RESTORE_MAX_ATTEMPTS = 80
const RESTORE_RETRY_MS = 100
/** After the card is in view, briefly defend against Next/layout scroll resets. */
const DEFENSE_WINDOW_MS = 900
/** Consecutive in-view checks before we stop early (snappier than full defense). */
const STABLE_HITS_REQUIRED = 3
/** Safety: never leave the page hidden if restore never settles. */
const RESTORING_PAINT_TIMEOUT_MS = 3500

type StoredScroll = {
  x: number
  y: number
  /** PDP path the user opened from this PLP, e.g. `/slug/p`. */
  anchor?: string
}

/**
 * Module-level state — must survive React effect remounts during back nav.
 */
let pendingPopRestore = false
let restoreGeneration = 0
/** History entry currently being restored; prevents popstate+complete from restarting. */
let activeRestoreKey: string | null = null
let restoringPaintTimer = 0

/**
 * Hide painted pixels while scroll jumps from top/footer to the saved product.
 * Applied before PLP paints so the user never sees the footer flash.
 */
function beginRestoringPaint() {
  document.documentElement.classList.add(RESTORING_SCROLL_CLASS)
  window.clearTimeout(restoringPaintTimer)
  restoringPaintTimer = window.setTimeout(
    endRestoringPaint,
    RESTORING_PAINT_TIMEOUT_MS
  )
}

function endRestoringPaint() {
  window.clearTimeout(restoringPaintTimer)
  restoringPaintTimer = 0
  document.documentElement.classList.remove(RESTORING_SCROLL_CLASS)
}
function historyStorageKey() {
  return window.history.state?.key ?? `path:${window.location.pathname}`
}

function readStoredScroll(key: string): StoredScroll | null {
  const stored = sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}${key}`)
  if (!stored) return null

  try {
    return JSON.parse(stored) as StoredScroll
  } catch {
    return null
  }
}

function writeStoredScroll(key: string, payload: StoredScroll) {
  sessionStorage.setItem(
    `${SCROLL_STORAGE_PREFIX}${key}`,
    JSON.stringify(payload)
  )
}

function normalizePath(path: string) {
  return path.split('?')[0].replace(/\/$/, '')
}

function pathMatchesAnchor(href: string, anchor: string) {
  const normalizedAnchor = normalizePath(anchor)
  try {
    return (
      normalizePath(new URL(href, window.location.origin).pathname) ===
      normalizedAnchor
    )
  } catch {
    return href.includes(normalizedAnchor)
  }
}

function destinationPathname(url: string) {
  try {
    return new URL(url, window.location.origin).pathname
  } catch {
    return url.split('?')[0]
  }
}

/**
 * Resolve the product *card* for a PDP path so we scroll the whole tile into
 * view (image + title), not only the small title link.
 */
function findAnchorCard(anchor: string): HTMLElement | null {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      'a[data-testid="product-link"], a[href*="/p"]'
    )
  )

  for (const link of links) {
    const href = link.getAttribute('href')
    if (!href || !pathMatchesAnchor(href, anchor)) continue

    const card = link.closest('[data-fs-product-card]')
    if (card instanceof HTMLElement) return card
    return link
  }

  return null
}

function isElementInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  return rect.top < vh * 0.75 && rect.bottom > vh * 0.25 && rect.height > 40
}

function scrollElementIntoView(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const absoluteTop = rect.top + window.scrollY
  const targetY = Math.max(
    0,
    absoluteTop - window.innerHeight / 2 + rect.height / 2
  )
  window.scrollTo({ top: targetY, left: 0, behavior: 'auto' })
}

function scrollToSavedPosition(stored: StoredScroll) {
  const maxScroll = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0
  )
  window.scrollTo(stored.x, Math.min(stored.y, maxScroll))
}

function cancelRestore() {
  restoreGeneration += 1
  activeRestoreKey = null
  endRestoringPaint()
}

/**
 * Instant approximate restore — call synchronously on popstate so the user is
 * not left at the top of the PLP while product cards finish mounting.
 */
function optimisticRestore() {
  const key = historyStorageKey()
  const stored = readStoredScroll(key)
  if (!stored) {
    endRestoringPaint()
    return
  }

  scrollToSavedPosition(stored)
  if (stored.anchor) {
    const el = findAnchorCard(stored.anchor)
    if (el) scrollElementIntoView(el)
  }
}

/**
 * Start (or no-op if already running for this history entry) a restore session.
 */
function scheduleRestore() {
  const key = historyStorageKey()
  const stored = readStoredScroll(key)
  if (!stored) {
    endRestoringPaint()
    return
  }

  // Same back-navigation can fire popstate + routeChangeComplete — do not
  // restart and cancel an in-flight restore for the same history entry.
  if (activeRestoreKey === key) return

  activeRestoreKey = key
  const generation = ++restoreGeneration
  const { y, anchor } = stored
  let attempts = 0
  let observer: MutationObserver | null = null
  let defenseUntil = 0
  let stableHits = 0

  // Paint the saved position immediately (before waiting on network/DOM).
  scrollToSavedPosition(stored)

  const cleanupObserver = () => {
    observer?.disconnect()
    observer = null
  }

  const finish = () => {
    if (generation !== restoreGeneration) return
    cleanupObserver()
    if (activeRestoreKey === key) activeRestoreKey = null
    endRestoringPaint()
  }

  const scheduleNext = () => {
    if (generation !== restoreGeneration) return
    // First frames: rAF for snappy refine once the card exists.
    // Later: 100ms while waiting on infinite-scroll pages / GraphQL.
    if (attempts < 8) {
      requestAnimationFrame(() => {
        window.setTimeout(tryRestore, 0)
      })
    } else {
      window.setTimeout(tryRestore, RESTORE_RETRY_MS)
    }
  }

  const tryRestore = () => {
    if (generation !== restoreGeneration) {
      cleanupObserver()
      return
    }

    attempts += 1

    if (anchor) {
      const el = findAnchorCard(anchor)
      if (el) {
        scrollElementIntoView(el)

        if (isElementInViewport(el)) {
          stableHits += 1
          if (!defenseUntil) {
            defenseUntil = Date.now() + DEFENSE_WINDOW_MS
          }
          if (
            stableHits >= STABLE_HITS_REQUIRED ||
            Date.now() >= defenseUntil
          ) {
            finish()
            return
          }
        } else {
          stableHits = 0
          defenseUntil = 0
        }

        if (attempts < RESTORE_MAX_ATTEMPTS) {
          scheduleNext()
        } else {
          finish()
        }
        return
      }

      // Card not in DOM yet — watch mutations and keep the optimistic Y.
      if (!observer) {
        observer = new MutationObserver(() => {
          if (generation !== restoreGeneration) return
          if (findAnchorCard(anchor)) tryRestore()
        })
        observer.observe(document.body, { childList: true, subtree: true })
      }

      if (attempts < RESTORE_MAX_ATTEMPTS) {
        scrollToSavedPosition(stored)
        scheduleNext()
      } else {
        finish()
      }
      return
    }

    // Fallback: raw coordinates when there is no usable anchor.
    scrollToSavedPosition(stored)

    if (y > 0 && attempts < RESTORE_MAX_ATTEMPTS) {
      window.setTimeout(() => {
        if (generation !== restoreGeneration) return
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          0
        )
        if (Math.abs(window.scrollY - Math.min(y, maxScroll)) > 40) {
          tryRestore()
        } else {
          finish()
        }
      }, RESTORE_RETRY_MS)
    } else {
      finish()
    }
  }

  // Kick off on the next frame so we run after Next's scroll-to-top.
  requestAnimationFrame(() => {
    window.setTimeout(tryRestore, 0)
  })
}

function markPendingRestore() {
  pendingPopRestore = true
  const key = historyStorageKey()
  try {
    sessionStorage.setItem(PENDING_RESTORE_FLAG, key)
  } catch {
    // ignore quota / private mode
  }
  // Only hide paint when this history entry has a saved PLP position —
  // otherwise every unrelated browser-back would flash blank.
  if (readStoredScroll(key)) {
    beginRestoringPaint()
  }
}

function consumePendingRestore() {
  const fromFlag = pendingPopRestore
  pendingPopRestore = false

  let flaggedKey: string | null = null
  try {
    flaggedKey = sessionStorage.getItem(PENDING_RESTORE_FLAG)
    sessionStorage.removeItem(PENDING_RESTORE_FLAG)
  } catch {
    // ignore
  }

  return fromFlag || flaggedKey !== null
}

function saveScrollPos(anchor?: string) {
  const key = historyStorageKey()
  const payload: StoredScroll = {
    x: window.scrollX,
    y: window.scrollY,
  }
  if (anchor) {
    payload.anchor = anchor
  } else {
    // Preserve a previously saved anchor for this history entry when we only
    // refresh coordinates (e.g. duplicate routeChangeStart).
    const prev = readStoredScroll(key)
    if (prev?.anchor) payload.anchor = prev.anchor
  }

  writeStoredScroll(key, payload)
}

export default function useScrollRestoration() {
  const router = useRouter()
  const { resetInfiniteScroll } = useSearch()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // Resume a restore interrupted by effect remount mid back-navigation.
    try {
      if (sessionStorage.getItem(PENDING_RESTORE_FLAG)) {
        consumePendingRestore()
        scheduleRestore()
      }
    } catch {
      // ignore
    }

    // Next types `BeforePopStateCallback` as NextHistoryState (url/as/options),
    // while runtime also carries `key`. Use history.state via markPendingRestore.
    const onBeforePopState = () => {
      markPendingRestore()
      return true
    }

    /**
     * Capture product navigations as early as possible — more reliable than
     * waiting for routeChangeStart (and works if the click target is nested).
     */
    const onClickCapture = (event: MouseEvent) => {
      if (pendingPopRestore) return
      if (!(event.target instanceof Element)) return

      const link = event.target.closest('a')
      if (!(link instanceof HTMLAnchorElement)) return

      const href = link.getAttribute('href')
      if (!href) return

      const destPath = destinationPathname(href)
      if (!destPath.endsWith('/p')) return

      // Only when leaving the current listing page toward a PDP.
      if (destPath === window.location.pathname) return

      saveScrollPos(destPath)
    }

    const onRouteChangeStart = (url: string) => {
      if (pendingPopRestore) return

      cancelRestore()

      const currentPath = window.location.pathname
      const destPath = destinationPathname(url)
      const isSamePathNavigation = url.includes(currentPath)
      const isPdpNavigation = destPath.endsWith('/p')

      if (!isSamePathNavigation) {
        saveScrollPos(isPdpNavigation ? destPath : undefined)
      }

      if (isSamePathNavigation || isPdpNavigation) return

      // Skip reset when leaving search — IS client redirects race with a
      // resetInfiniteScroll state update and can prevent navigation.
      if (currentPath === '/s') return

      resetInfiniteScroll(0)
    }

    const onRouteChangeComplete = () => {
      if (!consumePendingRestore()) return
      scheduleRestore()
    }

    const onRouteChangeError = () => {
      pendingPopRestore = false
      endRestoringPaint()
      try {
        sessionStorage.removeItem(PENDING_RESTORE_FLAG)
      } catch {
        // ignore
      }
    }

    const onPopState = () => {
      // Ensure flag is set even if beforePopState was replaced during remount.
      markPendingRestore()
      // Sync paint first — avoids a visible flash at the top of the PLP.
      optimisticRestore()
      scheduleRestore()
    }

    router.beforePopState(onBeforePopState)
    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    router.events.on('routeChangeError', onRouteChangeError)
    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onClickCapture, true)

    return () => {
      // Do not cancel in-flight restore or flip scrollRestoration to `auto` —
      // effect remounts during back-nav must not abort or fight the restore.
      router.beforePopState(() => true)
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
      router.events.off('routeChangeError', onRouteChangeError)
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClickCapture, true)
    }
    // resetInfiniteScroll is a stable Zustand action; omit from deps to avoid
    // re-binding router listeners on unrelated search state updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])
}
