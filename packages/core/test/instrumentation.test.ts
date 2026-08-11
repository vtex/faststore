import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { register } from '../src/instrumentation'

const getTelemetryClient = vi.hoisted(() => vi.fn())

vi.mock('@faststore/diagnostics', () => ({ getTelemetryClient }))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('register', () => {
  it.each(['nodejs', 'edge', undefined])(
    'does not boot telemetry on the %s runtime while the feature is off',
    async (runtime) => {
      vi.stubEnv('NEXT_RUNTIME', runtime)

      await expect(register()).resolves.toBeUndefined()
      expect(getTelemetryClient).not.toHaveBeenCalled()
    }
  )
})
