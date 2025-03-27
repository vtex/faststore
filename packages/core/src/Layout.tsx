import { useUI } from '@faststore/ui'
import type { PropsWithChildren, ReactElement } from 'react'
import { useEffect } from 'react'
import { sessionStore } from 'src/sdk/session'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

import { deliveryPromise } from 'discovery.config'
import { TIME_TO_VALIDATE_SESSION } from 'src/constants'

function Layout({ children }: PropsWithChildren) {
  usePageViewEvent((children as ReactElement)?.props)
  const { openModal } = useUI()

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
