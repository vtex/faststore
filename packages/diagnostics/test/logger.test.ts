import { logs } from '@opentelemetry/api-logs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import '../src/globals'
import { logger } from '../src/logger'

const emit = vi.fn()

beforeEach(() => {
  emit.mockClear()
  globalThis.fsDiagnostics.TELEMETRY_CLIENT = undefined
  vi.spyOn(logs, 'getLogger').mockReturnValue({ emit } as never)
})

afterEach(() => {
  vi.restoreAllMocks()
  globalThis.fsDiagnostics.TELEMETRY_CLIENT = undefined
})

/** Stands in for a started NodeSDK. */
const startTelemetry = () => {
  globalThis.fsDiagnostics.TELEMETRY_CLIENT = {} as never
}

describe('logger', () => {
  it('does not emit while telemetry is disabled', () => {
    logger('@faststore/core')('info', 'hello')

    expect(emit).not.toHaveBeenCalled()
  })

  it('does not format arguments while telemetry is disabled', () => {
    const expensive = { toString: vi.fn(() => 'expensive') }

    logger('@faststore/core')('debug', '%s', expensive)

    expect(expensive.toString).not.toHaveBeenCalled()
  })

  // Regression: emitters are held in module-level constants that are evaluated
  // before the SDK starts, so the provider must be resolved per call.
  it('emits once telemetry starts after the emitter was created', () => {
    const log = logger('@faststore/core')

    log('info', 'before')
    expect(emit).not.toHaveBeenCalled()

    startTelemetry()
    log('info', 'after')

    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit.mock.calls[0][0]).toMatchObject({
      severityText: 'INFO',
      body: 'after',
    })
  })

  it('applies printf-style formatting rather than inspecting the argument list', () => {
    startTelemetry()

    logger('@faststore/api')('error', 'Error at resolver: %s', 'StoreProduct')

    expect(emit.mock.calls[0][0].body).toBe('Error at resolver: StoreProduct')
  })

  it('maps each severity to its OTel severity number', () => {
    startTelemetry()
    const log = logger('@faststore/core')

    for (const severity of ['error', 'warn', 'info', 'debug'] as const) {
      log(severity, 'message')
    }

    expect(emit.mock.calls.map(([record]) => record.severityText)).toEqual([
      'ERROR',
      'WARN',
      'INFO',
      'DEBUG',
    ])
  })
})
