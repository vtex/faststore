/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    localization: { enabled: false, defaultLocale: 'pt-BR' },
    session: { locale: 'en-US' },
  },
}))

const mockUseSession = vi.hoisted(() => vi.fn(() => ({ locale: 'pt-BR' })))
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))

import {
  searchHistoryStore,
  type History,
} from '../../../src/sdk/search/useSearchHistory'
import useSearchHistory from '../../../src/sdk/search/useSearchHistory'

function makeHistory(term: string, path = `/s?q=${term}`) {
  return { term, path } satisfies History
}

describe('useSearchHistory', () => {
  beforeEach(() => {
    searchHistoryStore.set({})
    mockUseSession.mockReturnValue({ locale: 'pt-BR' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('searchHistory (read by locale)', () => {
    it('returns empty array when store is empty', () => {
      const { result } = renderHook(() => useSearchHistory())
      expect(result.current.searchHistory).toEqual([])
    })

    it('returns history for current locale when store has data for that locale', () => {
      const items = [makeHistory('tenis'), makeHistory('camisa')]
      searchHistoryStore.set({ 'pt-BR': items })

      const { result } = renderHook(() => useSearchHistory())
      expect(result.current.searchHistory).toEqual(items)
    })

    it('returns empty array when store has data only for another locale', () => {
      searchHistoryStore.set({
        'en-US': [makeHistory('shoes')],
      })

      const { result } = renderHook(() => useSearchHistory())
      expect(result.current.searchHistory).toEqual([])
    })

    it('uses session locale and shows correct slice when locale changes', () => {
      searchHistoryStore.set({
        'pt-BR': [makeHistory('tenis')],
        'en-US': [makeHistory('shoes')],
      })

      const { result, rerender } = renderHook(() => useSearchHistory())
      expect(result.current.searchHistory).toEqual([makeHistory('tenis')])

      mockUseSession.mockReturnValue({ locale: 'en-US' })
      rerender()
      expect(result.current.searchHistory).toEqual([makeHistory('shoes')])
    })
  })

  describe('addToSearchHistory', () => {
    it('adds item to current locale and persists', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addToSearchHistory(makeHistory('tenis'))
      })

      expect(result.current.searchHistory).toHaveLength(1)
      expect(result.current.searchHistory[0].term).toBe('tenis')
      expect(searchHistoryStore.read()).toEqual({
        'pt-BR': [makeHistory('tenis')],
      })
    })

    it('dedupes by term and moves to front', () => {
      searchHistoryStore.set({
        'pt-BR': [makeHistory('camisa'), makeHistory('tenis')],
      })
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addToSearchHistory(
          makeHistory('tenis', '/s?q=tenis&sort=score_desc')
        )
      })

      expect(result.current.searchHistory.map((h) => h.term)).toEqual([
        'tenis',
        'camisa',
      ])
      expect(result.current.searchHistory).toHaveLength(2)
    })

    it('respects maxHistorySize (default 4)', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => result.current.addToSearchHistory(makeHistory('a')))
      act(() => result.current.addToSearchHistory(makeHistory('b')))
      act(() => result.current.addToSearchHistory(makeHistory('c')))
      act(() => result.current.addToSearchHistory(makeHistory('d')))
      act(() => result.current.addToSearchHistory(makeHistory('e')))

      expect(result.current.searchHistory).toHaveLength(4)
      expect(result.current.searchHistory.map((h) => h.term)).toEqual([
        'e',
        'd',
        'c',
        'b',
      ])
    })

    it('can use custom maxHistorySize', () => {
      const { result } = renderHook(() => useSearchHistory(2))

      act(() => result.current.addToSearchHistory(makeHistory('a')))
      act(() => result.current.addToSearchHistory(makeHistory('b')))
      act(() => result.current.addToSearchHistory(makeHistory('c')))

      expect(result.current.searchHistory).toHaveLength(2)
      expect(result.current.searchHistory.map((h) => h.term)).toEqual([
        'c',
        'b',
      ])
    })

    it('does not affect other locales', () => {
      searchHistoryStore.set({
        'en-US': [makeHistory('shoes')],
      })
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addToSearchHistory(makeHistory('tenis'))
      })

      expect(searchHistoryStore.read()).toEqual({
        'en-US': [makeHistory('shoes')],
        'pt-BR': [makeHistory('tenis')],
      })
    })
  })

  describe('clearSearchHistory', () => {
    it('removes only current locale and leaves others', () => {
      searchHistoryStore.set({
        'pt-BR': [makeHistory('tenis')],
        'en-US': [makeHistory('shoes')],
      })
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.clearSearchHistory()
      })

      expect(result.current.searchHistory).toEqual([])
      expect(searchHistoryStore.read()).toEqual({
        'en-US': [makeHistory('shoes')],
      })
    })

    it('sets store to empty object when clearing last locale', () => {
      searchHistoryStore.set({ 'pt-BR': [makeHistory('tenis')] })
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.clearSearchHistory()
      })

      expect(searchHistoryStore.read()).toEqual({})
    })
  })

  describe('legacy format (array) migration', () => {
    it('normalizes array to Record with default locale and exposes as searchHistory when session matches default', () => {
      const legacy = [makeHistory('old1'), makeHistory('old2')]
      searchHistoryStore.set(legacy as unknown as Record<string, History[]>)
      mockUseSession.mockReturnValue({ locale: 'en-US' })

      const { result } = renderHook(() => useSearchHistory())

      expect(result.current.searchHistory).toHaveLength(2)
      expect(result.current.searchHistory.map((h) => h.term)).toEqual([
        'old1',
        'old2',
      ])
    })

    it('after migration persists Record so store no longer holds array', async () => {
      const legacy = [makeHistory('old1')]
      searchHistoryStore.set(legacy as unknown as Record<string, History[]>)
      mockUseSession.mockReturnValue({ locale: 'en-US' })

      renderHook(() => useSearchHistory())

      await act(async () => {
        await Promise.resolve()
      })

      const stored = searchHistoryStore.read()
      expect(Array.isArray(stored)).toBe(false)
      expect(stored).toHaveProperty('en-US')
      expect((stored as Record<string, History[]>)['en-US']).toHaveLength(1)
    })
  })
})
