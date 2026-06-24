/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@faststore/core/api', () => ({
  gql: (s: string) => ({ __meta__: {}, query: s }),
}))

const runStartSession = vi.hoisted(() => vi.fn())
const useLazyQueryMock = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/graphql/useLazyQuery', () => ({
  useLazyQuery: useLazyQueryMock,
}))

const getCookie = vi.hoisted(() => vi.fn())
vi.mock('src/utils/getCookie', () => ({ getCookie }))

import { useStartSession } from 'src/sdk/analytics/hooks/useStartSession'

beforeEach(() => {
  useLazyQueryMock.mockReturnValue([runStartSession, {}])
  runStartSession.mockResolvedValue(true)
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useStartSession', () => {
  it('does not start a session when the session cookie already exists', async () => {
    getCookie.mockReturnValue('already-started')

    renderHook(() => useStartSession())

    await waitFor(() => {
      expect(runStartSession).not.toHaveBeenCalled()
    })
  })

  it('starts a session when no session cookie is present', async () => {
    getCookie.mockReturnValue(undefined)

    renderHook(() => useStartSession())

    await waitFor(() => {
      expect(runStartSession).toHaveBeenCalled()
    })
  })
})
