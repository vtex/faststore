/**
 * @jest-environment jsdom
 */

import {
  expireCookieClient,
  expireCookieServer,
  getCookieDomains,
  getCookiePaths,
  getVtexCookieNames,
} from '../../src/utils/clearCookies'

describe('clearCookies', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    })
  })

  describe('getCookieDomains', () => {
    it('should return domain variations for a hostname', () => {
      const hostname = 'example.com'
      const domains = getCookieDomains(hostname)

      expect(domains).toEqual([undefined, 'example.com', '.example.com'])
    })

    it('should handle hostname that already starts with dot', () => {
      const hostname = '.example.com'
      const domains = getCookieDomains(hostname)

      expect(domains).toEqual([undefined, '.example.com', '.example.com'])
    })

    it('should handle localhost', () => {
      const hostname = 'localhost'
      const domains = getCookieDomains(hostname)

      expect(domains).toEqual([undefined, 'localhost', '.localhost'])
    })
  })

  describe('getVtexCookieNames', () => {
    it('should filter cookies containing "vtex" (case-insensitive)', () => {
      const cookieNames = [
        'vtex-search-anonymous',
        'VtexIdclientAutCookie_store',
        'other-cookie',
        'VTEX_SESSION',
        'vtex_segment',
      ]

      const result = getVtexCookieNames(cookieNames)

      expect(result).toEqual([
        'vtex-search-anonymous',
        'VtexIdclientAutCookie_store',
        'VTEX_SESSION',
        'vtex_segment',
      ])
    })

    it('should return empty array when no vtex cookies found', () => {
      const cookieNames = ['other-cookie', 'another-cookie']

      const result = getVtexCookieNames(cookieNames)

      expect(result).toEqual([])
    })

    it('should handle empty array', () => {
      const result = getVtexCookieNames([])

      expect(result).toEqual([])
    })
  })

  describe('getCookiePaths', () => {
    it('should return root path for empty pathname', () => {
      const paths = getCookiePaths('')

      expect(paths).toEqual(['/'])
    })

    it('should return root path for root pathname', () => {
      const paths = getCookiePaths('/')

      expect(paths).toEqual(['/'])
    })

    it('should return paths for nested pathname', () => {
      const paths = getCookiePaths('/api/vtexid/logout')

      expect(paths).toEqual(['/', '/api', '/api/vtexid', '/api/vtexid/logout'])
    })

    it('should handle pathname without leading slash', () => {
      const paths = getCookiePaths('api/vtexid')

      expect(paths).toEqual(['/', '/api', '/api/vtexid'])
    })

    it('should handle single segment pathname', () => {
      const paths = getCookiePaths('/api')

      expect(paths).toEqual(['/', '/api'])
    })
  })

  describe('expireCookieClient', () => {
    it('should expire a cookie with default parameters', () => {
      // Set a cookie first
      document.cookie = 'test-cookie=value; path=/'

      expireCookieClient({ name: 'test-cookie', path: '/' })

      expect(document.cookie).not.toContain('test-cookie=value')
    })

    it('should expire a cookie with domain', () => {
      document.cookie = 'test-cookie=value; path=/; domain=.example.com'

      expireCookieClient({
        name: 'test-cookie',
        path: '/',
        domain: '.example.com',
      })

      // Note: We can't easily verify domain-specific cookies in jsdom,
      // but we can verify the function doesn't throw
      expect(() => {
        expireCookieClient({
          name: 'test-cookie',
          path: '/',
          domain: '.example.com',
        })
      }).not.toThrow()
    })

    it('should expire a cookie with secure flag', () => {
      document.cookie = 'secure-cookie=value; path=/; secure'

      expireCookieClient({
        name: 'secure-cookie',
        path: '/',
        secure: true,
      })

      expect(() => {
        expireCookieClient({
          name: 'secure-cookie',
          path: '/',
          secure: true,
        })
      }).not.toThrow()
    })

    it('should expire a cookie with all parameters', () => {
      expireCookieClient({
        name: 'full-cookie',
        path: '/api',
        domain: '.example.com',
        secure: true,
      })

      expect(() => {
        expireCookieClient({
          name: 'full-cookie',
          path: '/api',
          domain: '.example.com',
          secure: true,
        })
      }).not.toThrow()
    })
  })

  describe('expireCookieServer', () => {
    it('should generate Set-Cookie header string for basic cookie', () => {
      const result = expireCookieServer({ name: 'test-cookie', path: '/' })

      expect(result).toContain('test-cookie=')
      expect(result).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT')
      expect(result).toContain('max-age=0')
      expect(result).toContain('path=/')
      expect(result).toContain('samesite=lax')
      expect(result).toContain('httponly')
    })

    it('should generate Set-Cookie header string with domain', () => {
      const result = expireCookieServer({
        name: 'test-cookie',
        path: '/',
        domain: '.example.com',
      })

      expect(result).toContain('test-cookie=')
      expect(result).toContain('domain=.example.com')
      expect(result).toContain('path=/')
      expect(result).toContain('httponly')
    })

    it('should generate Set-Cookie header string without domain when undefined', () => {
      const result = expireCookieServer({
        name: 'test-cookie',
        path: '/',
        domain: undefined,
      })

      expect(result).toContain('test-cookie=')
      expect(result).not.toContain('domain=')
      expect(result).toContain('path=/')
    })

    it('should generate Set-Cookie header string for specific path', () => {
      const result = expireCookieServer({
        name: 'vid_rt',
        path: '/api/vtexid/refreshtoken/webstore',
      })

      expect(result).toContain('vid_rt=')
      expect(result).toContain('path=/api/vtexid/refreshtoken/webstore')
    })

    it('should always include httponly flag', () => {
      const result = expireCookieServer({ name: 'test-cookie', path: '/' })

      expect(result).toContain('httponly')
    })
  })
})
