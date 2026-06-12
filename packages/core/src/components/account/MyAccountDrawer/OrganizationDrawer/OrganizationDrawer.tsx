import { SlideOver, useFadeEffect } from '@faststore/ui'
import { useState } from 'react'

import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'
import { useSession } from 'src/sdk/session'
import {
  expireCookieClient,
  getCookieDomains,
  getCookiePaths,
  getVtexCookieNames,
} from 'src/utils/clearCookies'
import storeConfig from '../../../../../discovery.config'
import { ContractSwitcher } from './ContractSwitcher'
import { OrganizationDrawerBody } from './OrganizationDrawerBody'
import { OrganizationDrawerFooter } from './OrganizationDrawerFooter'
import { OrganizationDrawerHeader } from './OrganizationDrawerHeader'
import { setReloadAfterLogoutReturn } from './useReloadAfterLogoutReturn'
import styles from './section.module.scss'

type OrganizationDrawerView = 'menu' | 'switch'

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
      'faststore_person_id',
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

  // Clear IndexedDB: remove session key first (avoids blocked when DB has open connections),
  // then delete the whole keyval-store
  try {
    if ('indexedDB' in window) {
      const { del } = await import('idb-keyval')
      await del('fs::session').catch(() => {})
    }

    const idb = window.indexedDB
    if (idb) {
      await new Promise<void>((resolve) => {
        const req = idb.deleteDatabase('keyval-store')
        req.onsuccess = () => resolve()
        req.onerror = () => resolve()
        req.onblocked = () => resolve()
      })
    }
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
}

export const doLogout = async (_event?: unknown) => {
  if (!storeConfig) return

  try {
    // Clear client-side storage (sessionStorage, localStorage, IndexedDB, non-HttpOnly cookies)
    await clearBrowserStorageForCurrentDomain()

    // Clear HttpOnly cookies via API endpoint (server-side).
    // Must await and consume the response so Set-Cookie headers are fully processed before redirect.
    try {
      const res = await fetch('/api/fs/logout', {
        method: 'POST',
        credentials: 'include',
      })
      await res.json().catch((): null => null)
    } catch {
      // Continue even if API call fails (e.g. network error)
    }
  } finally {
    setReloadAfterLogoutReturn()
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
  const { b2b } = useSession()
  const [view, setView] = useState<OrganizationDrawerView>('menu')

  const contractName = b2b?.contractName ?? ''

  const contractUrl = b2b?.unitId
    ? `/pvt/organization-account/org-unit/${b2b?.unitId}`
    : null

  const isOrganizationManager = b2b?.organizationManager || false
  // The switcher is only meaningful for B2B buyers tied to an Organization Unit.
  // Buyers with a single (or no alternative) contract see the empty state inside
  // the switcher; we don't fetch the contract count eagerly to protect TTFB.
  const canSwitchContract = Boolean(b2b?.unitId)

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
      {view === 'switch' ? (
        <ContractSwitcher
          onBack={() => setView('menu')}
          onClose={fadeOut}
          onSwitched={() => setView('menu')}
        />
      ) : (
        <div data-fs-organization-drawer-menu>
          <div data-fs-organization-drawer-menu-scroll>
            <OrganizationDrawerHeader
              onCloseDrawer={closeDrawer}
              contractName={contractName}
              contractUrl={contractUrl}
              onChangeContract={
                canSwitchContract ? () => setView('switch') : undefined
              }
            />
            <OrganizationDrawerBody isRepresentative={isRepresentative} />
          </div>
          <OrganizationDrawerFooter
            orgName={b2b?.unitName ?? ''}
            userName={b2b?.userName ?? ''}
            userEmail={b2b?.userEmail ?? ''}
            showManageLink={isOrganizationManager}
            manageUrl={contractUrl ?? undefined}
            onLogoutClick={doLogout}
          />
        </div>
      )}
    </SlideOver>
  )
}
