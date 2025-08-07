import { useUI } from '@faststore/ui'
import { deliveryPromise } from '../../../../discovery.config'
import { useEffect, useRef, useState } from 'react'
import { sessionStore, useSession } from '../../../sdk/session'

export function useRegionModal() {
  const { openModal: displayRegionModal } = useUI()
  const { isValidating } = useSession()

  // Ref to track the previous value of isValidating
  const prevIsValidating = useRef(isValidating)

  // State to track if validation is complete
  const [isValidationComplete, setValidationComplete] = useState(false)

  const openRegionModal = () => {
    const { postalCode } = sessionStore.read()
    if (!postalCode) {
      displayRegionModal()
    }
  }

  // Effect to handle when isValidating changes from true to false
  useEffect(() => {
    if (!deliveryPromise.enabled) {
      return
    }

    // Check if validation has completed (isValidating changed from true to false)
    if (prevIsValidating.current && !isValidating) {
      setValidationComplete(true)

      // If the postal code is not set and is mandatory, open the region modal
      if (deliveryPromise.mandatory) {
        openRegionModal()
      }
    }

    // Update the previous value of isValidating
    prevIsValidating.current = isValidating
  }, [openRegionModal])

  return { openRegionModal, isValidationComplete }
}
