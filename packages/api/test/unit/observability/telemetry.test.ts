import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { name, version } from '../../../package.json'
import { ResolverTrace } from '../../../src/observability/telemetry'

const otel = vi.hoisted(() => {
  const span = {
    end: vi.fn(),
    setStatus: vi.fn(),
    recordException: vi.fn(),
  }
  const startSpan = vi.fn(() => span)

  return {
    span,
    startSpan,
    log: vi.fn(),
    getTracer: vi.fn(() => ({ startSpan })),
    setSpan: vi.fn((context: unknown, activeSpan: unknown) => ({
      context,
      activeSpan,
    })),
    active: vi.fn(() => 'root-context'),
    with: vi.fn((_context: unknown, fn: () => unknown) => fn()),
  }
})

vi.mock('@faststore/diagnostics', () => ({
  logger: () => otel.log,
  OTELAPI: {
    SpanKind: { INTERNAL: 'INTERNAL' },
    SpanStatusCode: { ERROR: 'ERROR' },
    trace: {
      getTracer: otel.getTracer,
      setSpan: otel.setSpan,
    },
    context: {
      active: otel.active,
      with: otel.with,
    },
  },
}))

const makeContext = (OTEL_ENABLED: boolean) => ({
  OTEL_ENABLED,
  account: 'faststoretest',
  discoveryConfig: {},
})

const resolverInfo = {
  parentType: { name: 'StoreProduct' },
  fieldName: 'offers',
}

let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.clearAllMocks()
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleError.mockRestore()
})

describe('ResolverTrace when telemetry is disabled', () => {
  it('calls the resolver directly, forwarding every argument', () => {
    const resolver = vi.fn(() => 'result')
    const context = makeContext(false)

    const traced = ResolverTrace(resolver, 'Query(product)')

    expect(traced('source', { id: '1' }, context, resolverInfo)).toBe('result')
    expect(resolver).toHaveBeenCalledWith(
      'source',
      { id: '1' },
      context,
      resolverInfo
    )
    expect(otel.startSpan).not.toHaveBeenCalled()
  })

  it('calls the resolver directly when there is no graphql context', () => {
    const resolver = vi.fn(() => 'result')

    const traced = ResolverTrace(resolver, 'Query(product)')

    expect(traced('source', {}, undefined as never, resolverInfo)).toBe(
      'result'
    )
    expect(otel.startSpan).not.toHaveBeenCalled()
  })
})

describe('ResolverTrace when telemetry is enabled', () => {
  it('opens a span carrying the resolver and package metadata', () => {
    const traced = ResolverTrace(() => 'result', 'Query(product)')

    traced('source', {}, makeContext(true), resolverInfo)

    expect(otel.startSpan).toHaveBeenCalledWith('Query(product)', {
      kind: 'INTERNAL',
      attributes: {
        timestamp: expect.any(Number),
        '@faststore_version': version,
        '@faststore_package_name': name,
        '@faststore_account_name': 'faststoretest',
        '@faststore_environment': process.env.NODE_ENV,
        '@faststore_resolver_parent_type': 'StoreProduct',
        '@faststore_resolver_field_name': 'offers',
      },
    })
  })

  it('falls back to a placeholder name when the resolver is unnamed', () => {
    const traced = ResolverTrace(() => 'result')

    traced('source', {}, makeContext(true), undefined)

    expect(otel.startSpan).toHaveBeenCalledWith(
      'Unknown Graphql Resolver',
      expect.objectContaining({
        attributes: expect.objectContaining({
          '@faststore_resolver_parent_type': undefined,
          '@faststore_resolver_field_name': undefined,
        }),
      })
    )
  })

  it('runs a synchronous resolver inside the span context and ends the span', () => {
    const resolver = vi.fn(() => 'result')

    const traced = ResolverTrace(resolver, 'Query(product)')

    expect(traced('source', {}, makeContext(true), resolverInfo)).toBe('result')
    expect(otel.setSpan).toHaveBeenCalledWith('root-context', otel.span)
    expect(otel.with).toHaveBeenCalledWith(
      { context: 'root-context', activeSpan: otel.span },
      expect.any(Function)
    )
    expect(otel.span.end).toHaveBeenCalledTimes(1)
  })

  it('keeps the span open until an async resolver settles', async () => {
    const traced = ResolverTrace(
      () => Promise.resolve('result'),
      'Query(product)'
    )

    const pending = traced('source', {}, makeContext(true), resolverInfo)
    expect(otel.span.end).not.toHaveBeenCalled()

    await expect(pending).resolves.toBe('result')
    expect(otel.span.end).toHaveBeenCalledTimes(1)
    expect(otel.span.setStatus).not.toHaveBeenCalled()
  })

  it('records and rethrows a rejected async resolver', async () => {
    const error = new Error('upstream is down')
    const traced = ResolverTrace(() => Promise.reject(error), 'Query(product)')

    await expect(
      traced('source', {}, makeContext(true), resolverInfo)
    ).rejects.toThrow(error)

    expect(otel.span.setStatus).toHaveBeenCalledWith({ code: 'ERROR' })
    expect(otel.span.recordException).toHaveBeenCalledWith(error)
    expect(otel.span.end).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith(
      'Error at resolver: Query(product): \n %o',
      error
    )
    expect(otel.log).toHaveBeenCalledWith(
      'error',
      'Error at resolver: %s\n%o',
      'Query(product)',
      error
    )
  })

  it('records and rethrows a synchronous resolver failure', () => {
    const error = new Error('boom')
    const traced = ResolverTrace(() => {
      throw error
    }, 'Query(product)')

    expect(() => traced('source', {}, makeContext(true), resolverInfo)).toThrow(
      error
    )

    expect(otel.span.setStatus).toHaveBeenCalledWith({ code: 'ERROR' })
    expect(otel.span.recordException).toHaveBeenCalledWith(error)
    expect(otel.span.end).toHaveBeenCalledTimes(1)
  })
})
