import { useUI } from '@faststore/ui'
import type { PropsWithChildren, ReactElement } from 'react'
import { useEffect } from 'react'
import { sessionStore } from 'src/sdk/session'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

import { deliveryPromise } from 'discovery.config'

function Layout({ children }: PropsWithChildren) {
  usePageViewEvent((children as ReactElement)?.props)
  const { openModal } = useUI()

  const TIME_TO_VALIDATE_SESSION = 3000

  const openRegionModal = () => {
    const { postalCode } = sessionStore.read()
    if (!postalCode) {
      openModal()
    }
  }

  useEffect(() => {
    if (deliveryPromise.enabled && deliveryPromise.mandatory) {
      setTimeout(() => openRegionModal(), TIME_TO_VALIDATE_SESSION)
    }

    return
  }, [openModal])

  return <>{children}</>
}

export default Layout
