import { jest } from '@jest/globals'

import { createPromiseCache } from '../../../src/server/content/promiseCache'

describe('createPromiseCache', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('shares one in-flight load across concurrent callers', async () => {
    const cache = createPromiseCache<string>(1000)
    const load = jest.fn(async () => 'value')

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
    const load = jest.fn(async () => 'value')

    await cache.get('a', load)
    await cache.get('b', load)

    expect(load).toHaveBeenCalledTimes(2)
  })

  it('loads again after the TTL', async () => {
    jest.useFakeTimers()
    const cache = createPromiseCache<string>(1000)
    const load = jest.fn(async () => 'value')

    await cache.get('key', load)
    jest.advanceTimersByTime(999)
    await cache.get('key', load)
    expect(load).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1)
    await cache.get('key', load)
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('does not cache failures', async () => {
    const cache = createPromiseCache<string>(1000)
    const error = new Error('boom')
    const load = jest
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('value')

    await expect(cache.get('key', load)).rejects.toBe(error)
    await expect(cache.get('key', load)).resolves.toBe('value')
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('does not let a late failure evict a newer load', async () => {
    jest.useFakeTimers()
    const cache = createPromiseCache<string>(1000)
    let rejectFirst: (err: Error) => void = () => {}
    const load = jest
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
    jest.advanceTimersByTime(1000)
    await cache.get('key', load)

    rejectFirst(new Error('late failure'))
    await firstResult
    await cache.get('key', load)

    expect(load).toHaveBeenCalledTimes(2)
  })

  it('drops every entry on clear', async () => {
    const cache = createPromiseCache<string>(1000)
    const load = jest.fn(async () => 'value')

    await cache.get('key', load)
    cache.clear()
    await cache.get('key', load)

    expect(load).toHaveBeenCalledTimes(2)
  })
})
