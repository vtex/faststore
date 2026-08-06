import { createBaseStore } from '@faststore/sdk'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  SESSION_VALIDATION_WAIT_MS,
  waitForSessionValidated,
} from '../../../src/sdk/cart/waitForSessionValidated'

describe('waitForSessionValidated', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves immediately when session was already validated', async () => {
    const store = createBaseStore(true)

    await expect(waitForSessionValidated(store)).resolves.toBeUndefined()
  })

  it('resolves when session becomes validated after subscribe', async () => {
    const store = createBaseStore(false)

    const pending = waitForSessionValidated(store, 5_000)
    store.set(true)

    await expect(pending).resolves.toBeUndefined()
  })

  it('ignores subscribe callbacks while validated is still false', async () => {
    vi.useFakeTimers()
    const listeners: Array<(value: boolean) => void> = []
    const store = {
      read: vi.fn(() => false),
      subscribe: vi.fn((listener: (value: boolean) => void) => {
        listeners.push(listener)
        return () => {
          const index = listeners.indexOf(listener)
          if (index >= 0) {
            listeners.splice(index, 1)
          }
        }
      }),
      set: vi.fn(),
    }

    const pending = waitForSessionValidated(store, SESSION_VALIDATION_WAIT_MS)

    // Emit false — should not resolve yet
    for (const listener of listeners) {
      listener(false)
    }

    await vi.advanceTimersByTimeAsync(SESSION_VALIDATION_WAIT_MS)
    await expect(pending).resolves.toBeUndefined()
  })

  it('resolves on timeout when session never validates', async () => {
    vi.useFakeTimers()
    const store = createBaseStore(false)

    const pending = waitForSessionValidated(store, SESSION_VALIDATION_WAIT_MS)

    await vi.advanceTimersByTimeAsync(SESSION_VALIDATION_WAIT_MS)

    await expect(pending).resolves.toBeUndefined()
  })

  it('resolves the race when validation finishes between read and subscribe', async () => {
    let current = false
    const listeners: Array<(value: boolean) => void> = []

    const store = {
      read: vi.fn(() => {
        // First read: not validated. Second read (post-subscribe): validated.
        const value = current
        current = true
        return value
      }),
      subscribe: vi.fn((listener: (value: boolean) => void) => {
        listeners.push(listener)
        return () => {
          const index = listeners.indexOf(listener)
          if (index >= 0) {
            listeners.splice(index, 1)
          }
        }
      }),
      set: vi.fn(),
    }

    await expect(waitForSessionValidated(store, 5_000)).resolves.toBeUndefined()
    expect(store.subscribe).toHaveBeenCalledTimes(1)
    expect(store.read).toHaveBeenCalledTimes(2)
  })
})
