/**
 * @vitest-environment jsdom
 */

import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@faststore/sdk', () => ({
  useSearch: () => ({
    state: {
      term: null,
      sort: 'score_desc',
      selectedFacets: [],
    },
  }),
}))

import GalleryPageHeightLock, {
  buildGalleryPageHeightKey,
  getGalleryViewportBucket,
  getReservedGalleryHeight,
  readGalleryPageHeight,
} from 'src/components/ui/ProductGallery/GalleryPageHeightLock'

describe('GalleryPageHeightLock helpers', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('maps viewport widths to layout buckets', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 390,
    })
    expect(getGalleryViewportBucket()).toBe('mobile')

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 700,
    })
    expect(getGalleryViewportBucket()).toBe('tablet')

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1024,
    })
    expect(getGalleryViewportBucket()).toBe('notebook')

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1440,
    })
    expect(getGalleryViewportBucket()).toBe('desktop')
  })

  it('builds stable storage keys that include viewport', () => {
    const keyA = buildGalleryPageHeightKey(2, {
      path: '/office',
      term: null,
      sort: 'score_desc',
      selectedFacets: [],
      viewport: 'desktop',
    })
    const keyB = buildGalleryPageHeightKey(2, {
      path: '/office',
      term: null,
      sort: 'score_desc',
      selectedFacets: [],
      viewport: 'mobile',
    })

    expect(keyA).toContain('__fs_gallery_page_h_')
    expect(keyA).not.toBe(keyB)
  })

  it('reads and sums reserved gallery heights', () => {
    const search = {
      path: '/office',
      term: null,
      sort: 'score_desc',
      selectedFacets: [],
      viewport: 'desktop',
    }
    const key0 = buildGalleryPageHeightKey(0, search)
    const key1 = buildGalleryPageHeightKey(1, search)
    sessionStorage.setItem(key0, '800')
    sessionStorage.setItem(key1, '750')

    expect(readGalleryPageHeight(key0)).toBe(800)
    expect(readGalleryPageHeight('missing')).toBeNull()
    expect(getReservedGalleryHeight([0, 1, 2], search)).toBe(1550)
  })

  it('ignores invalid stored heights', () => {
    sessionStorage.setItem('bad-key', '0')
    expect(readGalleryPageHeight('bad-key')).toBeNull()
    sessionStorage.setItem('nan-key', 'nope')
    expect(readGalleryPageHeight('nan-key')).toBeNull()
  })
})

describe('GalleryPageHeightLock', () => {
  beforeEach(() => {
    sessionStorage.clear()
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1440,
    })
  })

  it('applies minHeight while skeleton is showing when a height was saved', async () => {
    const key = buildGalleryPageHeightKey(0, {
      path: '/',
      term: null,
      sort: 'score_desc',
      selectedFacets: [],
      viewport: 'desktop',
    })
    // Component uses window.location.pathname — jsdom default is "/"
    sessionStorage.setItem(key, '640')

    const { container } = render(
      <GalleryPageHeightLock page={0}>
        <div data-testid="skeleton">loading</div>
      </GalleryPageHeightLock>
    )

    const lock = container.querySelector(
      '[data-fs-gallery-page-height-lock]'
    ) as HTMLElement

    // Height is applied after mount (hydration-safe).
    await act(async () => {
      await Promise.resolve()
    })

    expect(lock.style.minHeight).toBe('640px')
    expect(screen.getByTestId('skeleton')).toBeTruthy()
  })

  it('releases minHeight once product cards are mounted', async () => {
    const key = buildGalleryPageHeightKey(0, {
      path: '/',
      term: null,
      sort: 'score_desc',
      selectedFacets: [],
      viewport: 'desktop',
    })
    sessionStorage.setItem(key, '640')

    const { container, rerender } = render(
      <GalleryPageHeightLock page={0}>
        <div data-testid="skeleton">loading</div>
      </GalleryPageHeightLock>
    )

    await act(async () => {
      await Promise.resolve()
    })

    const lock = container.querySelector(
      '[data-fs-gallery-page-height-lock]'
    ) as HTMLElement
    expect(lock.style.minHeight).toBe('640px')

    await act(async () => {
      rerender(
        <GalleryPageHeightLock page={0}>
          <div data-fs-product-card data-testid="card">
            Product
          </div>
        </GalleryPageHeightLock>
      )
    })

    expect(lock.style.minHeight).toBe('')
  })
})
