import { useUI } from '@faststore/ui'
import type { PropsWithChildren, ReactElement } from 'react'
import { useEffect } from 'react'
import { sessionStore } from 'src/sdk/session'

import { usePageViewEvent } from './sdk/analytics/hooks/usePageViewEvent'

import { deliveryPromise } from 'discovery.config'
import { TIME_TO_VALIDATE_SESSION } from 'src/constants'

function useRegionModal() {
  const { openModal } = useUI()

  const openRegionModal = () => {
    const { postalCode } = sessionStore.read()
    if (!postalCode) {
      openModal()
    }
  }
  return openRegionModal
}

function Layout({ children }: PropsWithChildren) {
  usePageViewEvent((children as ReactElement)?.props)
  const { openModal } = useUI()
  const openRegionModal = useRegionModal()

  // Opens the region modal if the delivery promise is enabled, mandatory, and the user has not set a postal code.
  // A delay is added to ensure the session is validated before triggering the modal.
  useEffect(() => {
    if (deliveryPromise.enabled && deliveryPromise.mandatory) {
      setTimeout(() => openRegionModal(), TIME_TO_VALIDATE_SESSION)
    }
    return
  }, [openModal])

  return <>{children}</>
}

export default Layout
