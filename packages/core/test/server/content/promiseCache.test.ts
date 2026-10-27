import { afterEach, describe, expect, it, vi } from 'vitest'

import { createPromiseCache } from '../../../src/server/content/promiseCache'

describe('createPromiseCache', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shares one in-flight load across concurrent callers', async () => {
    const cache = createPromiseCache<string>(1000)
    const load = vi.fn(async () => 'value')

    const results = await Promise.all([
      cache.get('key', load),
      cache.get('key', load),
      cache.get('key', load),
    ])

    expect(load).toHaveBeenCalledTimes(1)
    expect(results).toEqual(['value', 'value', 'value'])
  })

  it('keeps separate entries per key', async () => {
    const cache = createPromiseCache<string>(1000)
    const load = vi.fn(async () => 'value')

    await cache.get('a', load)
    await cache.get('b', load)

    expect(load).toHaveBeenCalledTimes(2)
  })

  it('loads again after the TTL', async () => {
    vi.useFakeTimers()
    const cache = createPromiseCache<string>(1000)
    const load = vi.fn(async () => 'value')

    await cache.get('key', load)
    vi.advanceTimersByTime(999)
    await cache.get('key', load)
    expect(load).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1)
    await cache.get('key', load)
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('does not cache failures', async () => {
    const cache = createPromiseCache<string>(1000)
    const error = new Error('boom')
    const load = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('value')

    await expect(cache.get('key', load)).rejects.toBe(error)
    await expect(cache.get('key', load)).resolves.toBe('value')
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('does not let a late failure evict a newer load', async () => {
    vi.useFakeTimers()
    const cache = createPromiseCache<string>(1000)
    let rejectFirst: (err: Error) => void = () => {}
    const load = vi
      .fn<() => Promise<string>>()
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectFirst = reject
          })
      )
      .mockResolvedValue('value')

    const first = cache.get('key', load)
    const firstResult = expect(first).rejects.toThrow('late failure')
    vi.advanceTimersByTime(1000)
    await cache.get('key', load)

    rejectFirst(new Error('late failure'))
    await firstResult
    await cache.get('key', load)

    expect(load).toHaveBeenCalledTimes(2)
  })

  it('does not keep values rejected by shouldCache', async () => {
    const cache = createPromiseCache<string>(1000)
    const load = vi.fn(async () => '')
    const shouldCache = (value: string) => value !== ''

    const concurrent = await Promise.all([
      cache.get('key', load, shouldCache),
      cache.get('key', load, shouldCache),
    ])
    await cache.get('key', load, shouldCache)

    expect(concurrent).toEqual(['', ''])
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('keeps values accepted by shouldCache', async () => {
    const cache = createPromiseCache<string>(1000)
    const load = vi.fn(async () => 'value')

    await cache.get('key', load, (value) => value !== '')
    await cache.get('key', load, (value) => value !== '')

    expect(load).toHaveBeenCalledTimes(1)
  })

  it('drops every entry on clear', async () => {
    const cache = createPromiseCache<string>(1000)
    const load = vi.fn(async () => 'value')

    await cache.get('key', load)
    cache.clear()
    await cache.get('key', load)

    expect(load).toHaveBeenCalledTimes(2)
  })
})
