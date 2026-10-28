/**
 * Applies the runtime Content Security Policy to a middleware response.
 *
 * Called from `middleware.ts` (v3) after password protection passes. Never
 * throws: any failure leaves the response unchanged (fail open).
 * Runs on the Edge runtime (v3 middleware): Web APIs only.
 */

import type { NextResponse } from 'next/server'

import { baseline } from './baseline'
import { buildCspHeaders } from './policy-builder'
import type { CspHeaders } from './policy-builder'
import { createSettingsClient } from './settings-client'
import type { CspSettings, SettingsClient } from './settings-client'

const LOG_PREFIX = '[faststore][csp]'

const HEADER_NAMES: ReadonlyArray<keyof CspHeaders> = [
  'Reporting-Endpoints',
  'Content-Security-Policy',
  'Content-Security-Policy-Report-Only',
]

/** One client per isolate, so every service instance shares the cache. */
let defaultClient: SettingsClient | null = null

function getDefaultSettingsClient(): SettingsClient {
  if (defaultClient === null) {
    defaultClient = createSettingsClient()
  }

  return defaultClient
}

/**
 * Only pass-through responses (`NextResponse.next()` or a rewrite) get CSP
 * headers. Redirects, `NextResponse.error()` and the password unlock flow
 * do not.
 */
function isPassThrough(response: NextResponse): boolean {
  return response.status === 200 && !response.headers.has('location')
}

export class CspService {
  private readonly client: SettingsClient

  /**
   * Built headers per settings record. The client returns the same object
   * until it fetches a new record, so the builder runs (and logs) once per
   * record instead of once per request.
   */
  private readonly built = new WeakMap<
    CspSettings,
    { storeId: string; headers: CspHeaders | null }
  >()

  private errorLogged = false

  constructor(client?: SettingsClient) {
    this.client = client ?? getDefaultSettingsClient()
  }

  /** Sets the CSP headers on `response` and returns the same response. */
  async apply(response: NextResponse, storeId: string): Promise<NextResponse> {
    try {
      if (!isPassThrough(response)) {
        return response
      }

      const settings = await this.client.get(storeId)

      if (!settings) {
        return response
      }

      const headers = this.headersFor(settings, storeId)

      if (!headers) {
        return response
      }

      for (const name of HEADER_NAMES) {
        const value = headers[name]

        if (value !== undefined) {
          response.headers.set(name, value)
        }
      }
    } catch (error) {
      if (!this.errorLogged) {
        this.errorLogged = true
        console.warn(`${LOG_PREFIX} could not apply CSP headers`, error)
      }
    }

    return response
  }

  private headersFor(
    settings: CspSettings,
    storeId: string
  ): CspHeaders | null {
    const memo = this.built.get(settings)

    if (memo && memo.storeId === storeId) {
      return memo.headers
    }

    const headers = buildCspHeaders(baseline, settings, storeId)
    this.built.set(settings, { storeId, headers })

    return headers
  }
}
