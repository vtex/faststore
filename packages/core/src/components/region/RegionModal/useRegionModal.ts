import { useUI } from '@faststore/ui'
import { deliveryPromise } from 'discovery.config'
import { useEffect, useRef } from 'react'
import { sessionStore, useSession } from 'src/sdk/session'

export function useRegionModal() {
  const { openModal } = useUI()
  const { isValidating } = useSession()

  // Ref to track the previous value of isValidating
  const prevIsValidating = useRef(isValidating)

  const openRegionModal = () => {
    const { postalCode } = sessionStore.read()
    if (!postalCode) {
      openModal()
    }
  }

  // Effect to handle when isValidating changes from true to false
  useEffect(() => {
    if (!deliveryPromise.enabled || !deliveryPromise.mandatory) {
      return
    }

    if (prevIsValidating.current && !isValidating) {
      openRegionModal()
    }

    // Update the previous value of isValidating
    prevIsValidating.current = isValidating
  }, [openRegionModal])

  return openRegionModal
}
