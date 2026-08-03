import { afterEach, describe, expect, it, vi } from 'vitest'

import { retry } from 'src/utils/retry'

afterEach(() => {
  vi.clearAllMocks()
})

describe('retry', () => {
  it('resolves immediately when the value is already available', async () => {
    const fn = vi.fn(() => 'ready')

    await expect(retry(fn)).resolves.toBe('ready')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries until a truthy value is returned', async () => {
    const fn = vi
      .fn<() => string>()
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValue('later')

    await expect(retry(fn, { attempts: 5, delayMs: 1 })).resolves.toBe('later')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('gives up after exhausting the retry budget', async () => {
    const fn = vi.fn(() => '')

    await expect(retry(fn, { attempts: 2, delayMs: 1 })).resolves.toBe('')
    // initial call + 2 retries
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('honours a custom `until` predicate', async () => {
    const fn = vi
      .fn<() => number | undefined>()
      .mockReturnValueOnce(undefined)
      .mockReturnValue(0)

    await expect(
      retry(fn, { attempts: 5, delayMs: 1, until: (v) => v !== undefined })
    ).resolves.toBe(0)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('stops retrying once the signal is aborted', async () => {
    const controller = new AbortController()
    const fn = vi.fn(() => '')
    controller.abort()

    await expect(
      retry(fn, { attempts: 5, delayMs: 1, signal: controller.signal })
    ).resolves.toBe('')
    // Only the initial call runs; the loop never starts because it is aborted.
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
