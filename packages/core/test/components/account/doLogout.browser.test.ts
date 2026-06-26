/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.hoisted(() => vi.fn())
const mockAssign = vi.hoisted(() => vi.fn())
const mockDel = vi.hoisted(() => vi.fn())
const mockSetReloadAfterLogoutReturn = vi.hoisted(() => vi.fn())
const mockGetStoreURL = vi.hoisted(() => vi.fn())
const mockExpireCookieClient = vi.hoisted(() => vi.fn())

vi.stubGlobal('fetch', mockFetch)
vi.mock('idb-keyval', () => ({ del: mockDel }))
vi.mock('src/sdk/localization/useLocalizationConfig', () => ({
  getStoreURL: mockGetStoreURL,
}))
vi.mock(
  '../../../src/components/account/Drawer/OrganizationDrawer/useReloadAfterLogoutReturn',
  () => ({
    setReloadAfterLogoutReturn: mockSetReloadAfterLogoutReturn,
  })
)
vi.mock('src/utils/clearCookies', () => ({
  expireCookieClient: mockExpireCookieClient,
  getCookieDomains: () => ['.example.com'],
  getCookiePaths: () => ['/'],
  getVtexCookieNames: (names: string[]) =>
    names.filter((name) => /vtex/i.test(name)),
}))
vi.mock('../../../discovery.config', () => ({
  default: {
    secureSubdomain: 'https://secure.example.com',
    api: { storeId: 'teststore' },
  },
}))

import { doLogout } from '../../../src/components/account/Drawer/OrganizationDrawer/OrganizationDrawer'

describe('doLogout', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      json: async () => ({}),
    })
    mockGetStoreURL.mockReturnValue('https://store.example.com')
    mockDel.mockResolvedValue(undefined)

    Object.defineProperty(globalThis, 'indexedDB', {
      configurable: true,
      value: {
        deleteDatabase: () => {
          const request = {
            onsuccess: null as (() => void) | null,
            onerror: null,
            onblocked: null,
          }

          queueMicrotask(() => request.onsuccess?.())

          return request
        },
      },
    })

    Object.defineProperty(globalThis.window, 'location', {
      configurable: true,
      value: {
        hostname: 'store.example.com',
        protocol: 'https:',
        pathname: '/',
        assign: mockAssign,
      },
    })

    document.cookie = 'VtexIdclientAutCookie_teststore=token; other=1'
    sessionStorage.setItem('faststore_session_ready', '1')
    sessionStorage.setItem('__fs_gallery_page_1', '1')
  })

  afterEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    document.cookie = ''
  })

  it('clears client storage, calls logout API, and redirects to VTEX logout', async () => {
    await doLogout()

    expect(mockDel).toHaveBeenCalledWith('fs::session')
    expect(sessionStorage.getItem('faststore_session_ready')).toBeNull()
    expect(sessionStorage.getItem('__fs_gallery_page_1')).toBeNull()
    expect(mockFetch).toHaveBeenCalledWith('/api/fs/logout', {
      method: 'POST',
      credentials: 'include',
    })
    expect(mockSetReloadAfterLogoutReturn).toHaveBeenCalledTimes(1)
    expect(mockAssign).toHaveBeenCalledWith(
      'https://secure.example.com/api/vtexid/pub/logout?scope=teststore&returnUrl=https://store.example.com'
    )
  })
})
