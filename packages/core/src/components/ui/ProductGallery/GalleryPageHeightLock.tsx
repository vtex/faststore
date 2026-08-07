import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from 'react'
import { useSearch } from '@faststore/sdk'

/** Coarse layout buckets — page height differs a lot across these. */
export function getGalleryViewportBucket() {
  if (typeof window === 'undefined') return 'ssr'
  const width = window.innerWidth
  if (width <= 420) return 'mobile'
  if (width <= 768) return 'tablet'
  if (width < 1280) return 'notebook'
  return 'desktop'
}

export function buildGalleryPageHeightKey(
  page: number,
  search: {
    path: string
    term: string | null
    sort: string | null
    selectedFacets: unknown
    viewport?: string
  }
) {
  const raw = JSON.stringify({
    path: search.path,
    term: search.term,
    sort: search.sort,
    selectedFacets: search.selectedFacets ?? [],
    page,
    viewport: search.viewport ?? getGalleryViewportBucket(),
  })
  return `__fs_gallery_page_h_${raw.replace(/\W/g, '_').slice(0, 180)}`
}

export function readGalleryPageHeight(key: string): number | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const height = Number(raw)
    return Number.isFinite(height) && height > 0 ? height : null
  } catch {
    return null
  }
}

function writeGalleryPageHeight(key: string, height: number) {
  try {
    sessionStorage.setItem(key, String(Math.round(height)))
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Sum of last-measured heights for the active infinite-scroll pages.
 * Used to reserve space for the whole gallery before individual pages mount.
 */
export function getReservedGalleryHeight(
  pages: number[],
  search: {
    path: string
    term: string | null
    sort: string | null
    selectedFacets: unknown
    viewport?: string
  }
) {
  return pages.reduce((sum, page) => {
    const height = readGalleryPageHeight(
      buildGalleryPageHeightKey(page, search)
    )
    return sum + (height ?? 0)
  }, 0)
}

type Props = PropsWithChildren<{
  page: number
}>

/**
 * Locks the gallery page slot to the last measured height **only while the
 * skeleton is showing**. Once real product cards are mounted, the lock is
 * released so a viewport resize cannot leave huge empty gaps between pages.
 */
function GalleryPageHeightLock({ page, children }: Props) {
  const {
    state: { term, sort, selectedFacets },
  } = useSearch()

  const [viewport, setViewport] = useState(getGalleryViewportBucket)

  useEffect(() => {
    const onResize = () => setViewport(getGalleryViewportBucket())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const storageKey = useMemo(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : ''
    return buildGalleryPageHeightKey(page, {
      path,
      term: term ?? null,
      sort: sort ?? null,
      selectedFacets,
      viewport,
    })
  }, [term, sort, selectedFacets, page, viewport])

  const ref = useRef<HTMLDivElement>(null)
  /** Height applied only while this page has no product cards yet. */
  // Start null on SSR and first client paint; storageKey effect applies the
  // sessionStorage value after mount to avoid hydration mismatches.
  const [pendingMinHeight, setPendingMinHeight] = useState<number | null>(null)
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    setPendingMinHeight(readGalleryPageHeight(storageKey))
    // Re-lock briefly when the viewport bucket / search key changes so back-nav
    // skeletons on a new breakpoint still get the right reserved height.
    setIsLocked(true)
  }, [storageKey])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const syncFromDom = () => {
      const hasProducts = Boolean(
        el.querySelector(
          '[data-fs-product-card], a[data-testid="product-link"]'
        )
      )

      if (!hasProducts) {
        // Skeleton / empty — keep (or restore) the reserved minHeight.
        setIsLocked(true)
        return
      }

      // Products are visible: drop the lock so natural height can shrink on
      // resize, then persist the unconstrained content height for next back-nav.
      setIsLocked(false)

      // Measure after minHeight is cleared (next frame).
      requestAnimationFrame(() => {
        const height = el.getBoundingClientRect().height
        if (height < 80) return
        const rounded = Math.round(height)
        writeGalleryPageHeight(storageKey, rounded)
        setPendingMinHeight(rounded)
      })
    }

    syncFromDom()

    const mutationObserver = new MutationObserver(syncFromDom)
    mutationObserver.observe(el, { childList: true, subtree: true })

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        // Only persist when unlocked (real layout). Observing while locked
        // would re-read the artificial minHeight and never shrink.
        if (
          !el.querySelector(
            '[data-fs-product-card], a[data-testid="product-link"]'
          )
        ) {
          return
        }
        const height = el.getBoundingClientRect().height
        if (height < 80) return
        const rounded = Math.round(height)
        writeGalleryPageHeight(storageKey, rounded)
        setPendingMinHeight(rounded)
      })
      resizeObserver.observe(el)
    }

    return () => {
      mutationObserver.disconnect()
      resizeObserver?.disconnect()
    }
    // Re-sync when children swap (e.g. skeleton → product grid). MutationObserver
    // alone is not reliable across React rerenders in jsdom/CI.
  }, [storageKey, children])

  const style: CSSProperties | undefined =
    isLocked && pendingMinHeight ? { minHeight: pendingMinHeight } : undefined

  return (
    <div
      ref={ref}
      data-fs-gallery-page-height-lock
      data-fs-gallery-page={page}
      style={style}
    >
      {children}
    </div>
  )
}

export default GalleryPageHeightLock
