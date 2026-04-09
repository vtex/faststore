import type { NextApiRequest } from 'next'
import { NextRequest } from 'next/server'

import {
  isSecureAuthCookieForMiddleware,
  isSecureAuthCookieForPagesApi,
} from '../../../src/server/password-protection/auth-cookie'

function setNodeEnv(value: string | undefined): void {
  const env = process.env as Record<string, string | undefined>
  env.NODE_ENV = value
}

describe('auth-cookie', () => {
  const originalNodeEnv = process.env.NODE_ENV

  afterEach(() => {
    setNodeEnv(originalNodeEnv)
  })

  describe('isSecureAuthCookieForMiddleware', () => {
    it('returns false in development', () => {
      setNodeEnv('development')

      const request = new NextRequest('https://preview.vtex.app/', {
        headers: { host: 'preview.vtex.app' },
      })

      expect(isSecureAuthCookieForMiddleware(request)).toBe(false)
    })

    it('returns false for loopback host in production', () => {
      setNodeEnv('production')

      const request = new NextRequest('http://localhost:3000/', {
        headers: { host: 'localhost:3000' },
      })

      expect(isSecureAuthCookieForMiddleware(request)).toBe(false)
    })

    it('returns true for HTTPS preview host when forwarded proto is https', () => {
      setNodeEnv('production')

      const request = new NextRequest('https://store.vtex.app/', {
        headers: {
          host: 'store.vtex.app',
          'x-forwarded-proto': 'https',
        },
      })

      expect(isSecureAuthCookieForMiddleware(request)).toBe(true)
    })

    it('uses URL protocol when forwarded proto is absent', () => {
      setNodeEnv('production')

      const request = new NextRequest('https://store.vtex.app/', {
        headers: { host: 'store.vtex.app' },
      })

      expect(isSecureAuthCookieForMiddleware(request)).toBe(true)
    })
  })

  describe('isSecureAuthCookieForPagesApi', () => {
    it('returns false in development', () => {
      setNodeEnv('development')

      const request = {
        headers: { host: 'preview.vtex.app' },
      } as unknown as NextApiRequest

      expect(isSecureAuthCookieForPagesApi(request)).toBe(false)
    })

    it('returns false for localhost in production', () => {
      setNodeEnv('production')

      const request = {
        headers: { host: 'localhost:3000' },
      } as unknown as NextApiRequest

      expect(isSecureAuthCookieForPagesApi(request)).toBe(false)
    })

    it('returns true in production when x-forwarded-proto is https', () => {
      setNodeEnv('production')

      const request = {
        headers: {
          host: 'api.example.com',
          'x-forwarded-proto': 'https',
        },
      } as unknown as NextApiRequest

      expect(isSecureAuthCookieForPagesApi(request)).toBe(true)
    })

    it('defaults to true in production without forwarded proto (non-localhost)', () => {
      setNodeEnv('production')

      const request = {
        headers: { host: 'api.example.com' },
      } as unknown as NextApiRequest

      expect(isSecureAuthCookieForPagesApi(request)).toBe(true)
    })
  })
})
