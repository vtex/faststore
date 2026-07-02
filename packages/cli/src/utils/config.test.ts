import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isMyAccountEnabled, resolveContentSource } from './config'
import { logger } from './logger'

describe('resolveContentSource', () => {
  let exitMock: ReturnType<typeof vi.spyOn>
  let errorMock: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    exitMock = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
    errorMock = vi.spyOn(logger, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    exitMock.mockRestore()
    errorMock.mockRestore()
  })

  it('returns CMS when type is undefined', () => {
    expect(resolveContentSource(undefined)).toBe('CMS')
  })

  it('returns CMS for cms/CMS (case-insensitive)', () => {
    expect(resolveContentSource('cms')).toBe('CMS')
    expect(resolveContentSource('CMS')).toBe('CMS')
  })

  it('returns CP for cp/CP (case-insensitive)', () => {
    expect(resolveContentSource('cp')).toBe('CP')
    expect(resolveContentSource('CP')).toBe('CP')
  })

  it('exits with code 1 for unsupported types', () => {
    resolveContentSource('WORDPRESS')

    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported contentSource.type "WORDPRESS"')
    )
    expect(exitMock).toHaveBeenCalledWith(1)
  })
})

describe('isMyAccountEnabled', () => {
  it('returns true when experimental.enableFaststoreMyAccount is true', () => {
    expect(
      isMyAccountEnabled({ experimental: { enableFaststoreMyAccount: true } })
    ).toBe(true)
  })

  it('returns false when explicitly disabled', () => {
    expect(
      isMyAccountEnabled({ experimental: { enableFaststoreMyAccount: false } })
    ).toBe(false)
  })

  it('returns false when the flag, experimental, or config is absent', () => {
    expect(isMyAccountEnabled({ experimental: {} })).toBe(false)
    expect(isMyAccountEnabled({})).toBe(false)
    expect(isMyAccountEnabled(null)).toBe(false)
    expect(isMyAccountEnabled(undefined)).toBe(false)
  })
})
