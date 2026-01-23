import { describe, expect, it } from 'vitest'
import {
  getCustomPathsFromBindings,
  isCustomPath,
} from '../../src/utils/customPaths'

describe('customPaths', () => {
  describe('isCustomPath', () => {
    it('returns false for root path', () => {
      expect(isCustomPath('https://example.com/')).toBe(false)
      expect(isCustomPath('https://example.com')).toBe(false)
    })

    it('returns false for canonical locale paths', () => {
      expect(isCustomPath('https://example.com/pt-BR')).toBe(false)
      expect(isCustomPath('https://example.com/en-US/')).toBe(false)
      expect(isCustomPath('https://example.com/it-IT')).toBe(false)
    })

    it('returns true for custom paths', () => {
      expect(isCustomPath('https://example.com/pt/br')).toBe(true)
      expect(isCustomPath('https://example.com/europe/it')).toBe(true)
      expect(isCustomPath('https://example.com/america/pt')).toBe(true)
    })

    it('returns false for invalid URLs', () => {
      expect(isCustomPath('not-a-url')).toBe(false)
      expect(isCustomPath('')).toBe(false)
    })
  })

  describe('getCustomPathsFromBindings', () => {
    it('returns an array', () => {
      const paths = getCustomPathsFromBindings()
      expect(Array.isArray(paths)).toBe(true)
    })

    it('returns paths sorted by length (longest first)', () => {
      const paths = getCustomPathsFromBindings()

      if (paths.length > 1) {
        for (let i = 0; i < paths.length - 1; i++) {
          expect(paths[i].path.length).toBeGreaterThanOrEqual(
            paths[i + 1].path.length
          )
        }
      }
    })

    it('returns paths with locale information', () => {
      const paths = getCustomPathsFromBindings()

      paths.forEach((pathInfo) => {
        expect(pathInfo).toHaveProperty('path')
        expect(pathInfo).toHaveProperty('locale')
        expect(typeof pathInfo.path).toBe('string')
        expect(typeof pathInfo.locale).toBe('string')
      })
    })
  })
})
