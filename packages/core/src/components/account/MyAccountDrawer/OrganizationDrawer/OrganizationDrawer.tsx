import { SlideOver, useFadeEffect } from '@faststore/ui'

import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'
import { useSession } from 'src/sdk/session'
import {
  expireCookieClient,
  getCookieDomains,
  getCookiePaths,
  getVtexCookieNames,
} from 'src/utils/clearCookies'
import storeConfig from '../../../../../discovery.config'
import { ProfileSummary } from '../ProfileSummary/ProfileSummary'
import { OrganizationDrawerBody } from './OrganizationDrawerBody'
import { OrganizationDrawerHeader } from './OrganizationDrawerHeader'
import styles from './section.module.scss'

type OrganizationDrawerProps = {
  isOpen: boolean
  closeDrawer: () => void
  isRepresentative: boolean
}

const clearBrowserStorageForCurrentDomain = async () => {
  if (typeof window === 'undefined' || !storeConfig) return

  // Clear Faststore-specific sessionStorage keys
  try {
    const sessionStorageKeys = [
      'faststore_session_ready',
      'faststore_auth_cookie_value',
      'faststore_cache_bust_last_value',
    ]

    for (const key of sessionStorageKeys) {
      try {
        window.sessionStorage?.removeItem(key)
      } catch {}
    }

    // Remove all keys starting with __fs_gallery_page_ (used for PLP pagination)
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i)
        if (key && key.startsWith('__fs_gallery_page_')) {
          keysToRemove.push(key)
        }
      }
      for (const key of keysToRemove) {
        try {
          window.sessionStorage.removeItem(key)
        } catch {}
      }
    } catch {}
  } catch {}

  // Clear all cookies containing 'vtex' in the name (case-insensitive)
  try {
    const hostname = window.location.hostname
    const secure = window.location.protocol === 'https:'

    // Extract all cookie names from document.cookie
    const allCookieNames = document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => c.split('=')[0])
      .filter(Boolean)

    const vtexCookieNames = getVtexCookieNames(allCookieNames)
    const paths = getCookiePaths(window.location.pathname || '/')
    const domains = getCookieDomains(hostname)

    for (const name of vtexCookieNames) {
      for (const path of paths) {
        for (const domain of domains) {
          try {
            expireCookieClient({ name, path, domain, secure })
          } catch {}
        }
      }
    }
  } catch {}

  // Clear IndexedDB (keyval-store)
  try {
    if (!('indexedDB' in window)) return

    const idb = window.indexedDB
    if (!idb) return

    await new Promise<void>((resolve) => {
      const req = idb.deleteDatabase('keyval-store')
      req.onsuccess = () => resolve()
      req.onerror = () => resolve()
      req.onblocked = () => resolve()
    })
  } catch {}
}

export const doLogout = async (_event?: unknown) => {
  if (!storeConfig) return

  try {
    // Clear client-side storage (sessionStorage, localStorage, IndexedDB, non-HttpOnly cookies)
    await clearBrowserStorageForCurrentDomain()

    // Clear HttpOnly cookies via API endpoint (server-side)
    try {
      await fetch('/api/fs/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Continue even if API call fails
    }
  } finally {
    window.location.assign(
      `${storeConfig.secureSubdomain}/api/vtexid/pub/logout?scope=${storeConfig.api.storeId}&returnUrl=${getStoreURL()}`
    )
  }
}

export const OrganizationDrawer = ({
  isOpen,
  closeDrawer,
  isRepresentative,
}: OrganizationDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()
  const { b2b, person } = useSession()

  const contractName =
    b2b?.contractName ??
    `${(person?.givenName ?? '').trim()} ${(person?.familyName ?? '').trim()}`.trim() ??
    ''

  const contractUrl = b2b?.unitId
    ? `/pvt/organization-account/org-unit/${b2b?.unitId}`
    : null

  const isOrganizationManager = b2b?.organizationManager || false

  return (
    <SlideOver
      data-fs-organization-drawer
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && closeDrawer()}
      isOpen={isOpen}
      size="partial"
      direction="rightSide"
      overlayProps={{
        className: `section ${styles.section} section-organization-drawer`,
      }}
    >
      <OrganizationDrawerHeader
        onCloseDrawer={closeDrawer}
        contractName={contractName}
        contractUrl={contractUrl}
      />
      <OrganizationDrawerBody isRepresentative={isRepresentative} />
      <footer data-fs-organization-drawer-footer-wrapper>
        <ProfileSummary
          showManageLink={isOrganizationManager}
          bordered={true}
          onLogoutClick={doLogout}
          person={{
            name: b2b?.userName ?? '',
            email: b2b?.userEmail ?? '',
          }}
          orgName={b2b?.unitName ?? ''}
        />
      </footer>
    </SlideOver>
  )
}
