import { describe, expect, it } from 'vitest'
import { addCustomPathPrefix } from '../../src/utils/addCustomPathPrefix'

describe('addCustomPathPrefix', () => {
  it('returns link as-is if it does not start with /', () => {
    expect(addCustomPathPrefix('https://example.com', '/europe/it')).toBe(
      'https://example.com'
    )
    expect(addCustomPathPrefix('mailto:test@example.com', '/europe/it')).toBe(
      'mailto:test@example.com'
    )
  })

  it('returns link as-is if it already has custom path prefix', () => {
    const link = '/europe/it/apparel'
    const currentPath = '/europe/it/sporting'
    const result = addCustomPathPrefix(link, currentPath)

    expect(result).toBe(link)
  })

  it('adds prefix when link does not have one and current path has prefix', () => {
    const link = '/apparel'
    const currentPath = '/europe/it/sporting'

    const result = addCustomPathPrefix(link, currentPath)

    if (currentPath.startsWith('/europe/it')) {
      expect(result).toBe('/europe/it/apparel')
    }
  })

  it('returns link as-is when current path has no custom prefix', () => {
    const link = '/apparel'
    const currentPath = '/pt-BR/apparel'

    const result = addCustomPathPrefix(link, currentPath)

    expect(result).toBe(link)
  })

  it('handles root path correctly', () => {
    const link = '/'
    const currentPath = '/europe/it/apparel'

    const result = addCustomPathPrefix(link, currentPath)

    if (currentPath.startsWith('/europe/it')) {
      expect(result).toBe('/europe/it/')
    }
  })
})
