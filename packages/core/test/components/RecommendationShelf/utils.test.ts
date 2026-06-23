import { afterEach, describe, expect, it, vi } from 'vitest'

import { getWithRetry } from 'src/components/RecommendationShelf/utils'

afterEach(() => {
  vi.clearAllMocks()
})

describe('getWithRetry', () => {
  it('resolves immediately when the value is already available', async () => {
    const fn = vi.fn(() => 'ready')
    await expect(getWithRetry(fn)).resolves.toBe('ready')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries until a truthy value is returned', async () => {
    const fn = vi
      .fn<() => string>()
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValue('later')

    await expect(getWithRetry(fn, { retries: 5, delayMs: 1 })).resolves.toBe(
      'later'
    )
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('gives up after exhausting the retry budget', async () => {
    const fn = vi.fn(() => '')

    await expect(getWithRetry(fn, { retries: 2, delayMs: 1 })).resolves.toBe('')
    // initial call + 2 retries
    expect(fn).toHaveBeenCalledTimes(3)
  })
})
