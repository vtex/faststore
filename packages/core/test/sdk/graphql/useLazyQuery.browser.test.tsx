import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react'
import { type ReactNode, useEffect } from 'react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { request } from '../../../src/sdk/graphql/request'
import { useLazyQuery } from '../../../src/sdk/graphql/useLazyQuery'

vi.mock('../../../src/sdk/graphql/request', () => ({ request: vi.fn() }))
// Keeps the session store out of this test; only the cache-key suffix is read.
vi.mock('../../../src/utils/cookieCacheBusting', () => ({
  getClientCacheBustingValue: () => '',
}))

const requestMock = vi.mocked(request)

type Variables = Record<string, unknown>

const operation = {
  __meta__: { operationName: 'TestLazyQuery', operationHash: 'test-hash' },
}

const PAYLOAD = { result: { value: 1 } }

// Fresh SWR cache per test.
const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
)

// Common call site: `execute` listed in an effect's dependency array.
function Consumer({ input }: { input: Variables; tick: number }) {
  const [execute, { data }] = useLazyQuery<typeof PAYLOAD, Variables>(
    operation,
    {}
  )

  useEffect(() => {
    execute(input)
  }, [input, execute])

  return <span data-testid="state">{data ? 'loaded' : 'loading'}</span>
}

const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

describe('useLazyQuery', () => {
  beforeEach(() => {
    requestMock.mockReset()
    // New object per call, like parsing a fresh response.
    requestMock.mockImplementation(async () =>
      JSON.parse(JSON.stringify(PAYLOAD))
    )
  })

  it('returns the same execute function across re-renders', () => {
    const { result, rerender } = renderHook(() => useLazyQuery(operation, {}), {
      wrapper,
    })
    const firstExecute = result.current[0]

    rerender()
    rerender()

    expect(result.current[0]).toBe(firstExecute)
  })

  it('does not re-run effects that depend on execute when the parent re-renders', async () => {
    const input = { id: '1' }
    const { rerender } = render(<Consumer input={input} tick={0} />, {
      wrapper,
    })

    await waitFor(() =>
      expect(screen.getByTestId('state').textContent).toBe('loaded')
    )

    for (let tick = 1; tick <= 5; tick++) {
      rerender(<Consumer input={input} tick={tick} />)
    }
    await flush()

    expect(requestMock).toHaveBeenCalledTimes(1)
  })

  it('runs again when the effect input changes', async () => {
    const { rerender } = render(<Consumer input={{ id: '1' }} tick={0} />, {
      wrapper,
    })
    await waitFor(() =>
      expect(screen.getByTestId('state').textContent).toBe('loaded')
    )
    await flush()

    rerender(<Consumer input={{ id: '2' }} tick={0} />)
    await flush()

    expect(requestMock).toHaveBeenCalledTimes(2)
    expect(requestMock.mock.calls[1][1]).toEqual({ id: '2' })
  })

  it('uses the latest options passed to the hook', async () => {
    const { result, rerender } = renderHook(
      ({ cache }: { cache: RequestCache }) =>
        useLazyQuery(operation, {}, { fetchOptions: { cache } }),
      { wrapper, initialProps: { cache: 'default' } }
    )

    rerender({ cache: 'no-cache' })

    await act(async () => {
      await result.current[0]({ id: '1' })
    })

    expect(requestMock).toHaveBeenCalledWith(
      operation,
      { id: '1' },
      { fetchOptions: { cache: 'no-cache' } }
    )
  })

  it('resolves with the response and stores it in the SWR state', async () => {
    // Read `data` during render: SWR only re-renders for fields the render reads.
    const { result } = renderHook(
      () => {
        const [execute, response] = useLazyQuery<typeof PAYLOAD, Variables>(
          operation,
          {}
        )
        return { execute, data: response.data }
      },
      { wrapper }
    )

    let returned: unknown
    await act(async () => {
      returned = await result.current.execute({ id: '1' })
    })

    expect(returned).toEqual(PAYLOAD)
    expect(result.current.data).toEqual(PAYLOAD)
  })
})
