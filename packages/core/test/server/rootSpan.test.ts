import { OTELAPI } from '@faststore/diagnostics'
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { execute } from '../../src/server'
import { apiOptions } from '../../src/server/options'

const span = {
  end: vi.fn(),
  setStatus: vi.fn(),
  recordException: vi.fn(),
}

const startSpan = vi.fn(() => span)

const otelEnabledByDefault = apiOptions.OTEL_ENABLED

// `__typename` resolves inside GraphQL itself, so these run the whole envelop
// pipeline without reaching the VTEX platform.
const runOperation = (query: string, operationName?: string) =>
  execute({
    operation: { __meta__: { operationName, operationHash: 'not-persisted' } },
    variables: {},
    query,
  })

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(OTELAPI.trace, 'getTracer').mockReturnValue({ startSpan } as never)
  apiOptions.OTEL_ENABLED = true
})

afterEach(() => {
  vi.restoreAllMocks()
})

afterAll(() => {
  apiOptions.OTEL_ENABLED = otelEnabledByDefault
})

describe('execute root span', () => {
  it('wraps the operation in a span named after it', async () => {
    const { data } = await runOperation(
      'query RootSpanQuery { __typename }',
      'RootSpanQuery'
    )

    expect(data).toEqual({ __typename: 'Query' })
    expect(startSpan).toHaveBeenCalledWith('graphql RootSpanQuery')
    expect(span.end).toHaveBeenCalledTimes(1)
    expect(span.setStatus).not.toHaveBeenCalled()
  })

  it('names the span generically when the operation is anonymous', async () => {
    await runOperation('{ __typename }')

    expect(startSpan).toHaveBeenCalledWith('graphql operation')
  })

  it('marks the span as failed and ends it when the operation throws', async () => {
    await expect(
      runOperation('this is not graphql', 'BrokenQuery')
    ).rejects.toThrow(/Syntax Error/)

    expect(span.setStatus).toHaveBeenCalledWith({
      code: OTELAPI.SpanStatusCode.ERROR,
    })
    expect(span.recordException).toHaveBeenCalledWith(expect.any(Error))
    expect(span.end).toHaveBeenCalledTimes(1)
  })

  it('skips instrumentation entirely when telemetry is disabled', async () => {
    apiOptions.OTEL_ENABLED = false

    const { data } = await runOperation(
      'query RootSpanQuery { __typename }',
      'RootSpanQuery'
    )

    expect(data).toEqual({ __typename: 'Query' })
    expect(startSpan).not.toHaveBeenCalled()
  })
})
