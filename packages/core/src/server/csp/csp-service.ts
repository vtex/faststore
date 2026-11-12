import type { NextResponse } from 'next/server'

import { baseline } from './baseline'
import type { CspSettings } from './data-plane-api'
import { buildCspHeaders, type CspHeaders } from './policy-builder'
import { createSettingsClient, type SettingsClient } from './settings-client'

/**
 * Adds the CSP headers of one store to a pass-through response
 * (`NextResponse.next()` or a rewrite).
 *
 * Never throws: any failure leaves the response unchanged (fail open).
 * Redirects and error responses are returned untouched.
 */

let defaultClient: SettingsClient | null = null

function getDefaultSettingsClient(): SettingsClient {
  if (!defaultClient) {
    defaultClient = createSettingsClient()
  }

  return defaultClient
}

function isPassThroughResponse(response: NextResponse): boolean {
  return (
    response.type !== 'error' &&
    response.status >= 200 &&
    response.status < 300 &&
    !response.headers.has('location')
  )
}

export class CspService {
  private readonly client: SettingsClient
  /**
   * Last built headers. The settings client returns the same object while
   * the cache entry is unchanged, so most requests skip the build and its
   * warnings are logged once per record.
   */
  private lastBuild: {
    settings: CspSettings
    storeId: string
    headers: CspHeaders | null
  } | null = null

  constructor(client?: SettingsClient) {
    this.client = client ?? getDefaultSettingsClient()
  }

  async apply(response: NextResponse, storeId: string): Promise<NextResponse> {
    try {
      if (!isPassThroughResponse(response)) {
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

      for (const name of Object.keys(headers) as Array<keyof CspHeaders>) {
        const value = headers[name]

        if (value) {
          response.headers.set(name, value)
        }
      }
    } catch (error) {
      console.warn('[CSP] could not apply CSP headers', error)
    }

    return response
  }

  private headersFor(settings: CspSettings, storeId: string) {
    const last = this.lastBuild

    if (last && last.settings === settings && last.storeId === storeId) {
      return last.headers
    }

    const headers = buildCspHeaders(baseline, settings, storeId)
    this.lastBuild = { settings, storeId, headers }

    return headers
  }
}
