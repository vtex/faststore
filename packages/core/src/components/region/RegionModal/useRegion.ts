import { useEffect, useRef, useState } from 'react'

import type { Session } from '@faststore/sdk'
import { sessionStore, useSession, validateSession } from 'src/sdk/session'

import { useUI } from '@faststore/ui'
import { deliveryPromise } from 'discovery.config'

interface UseRegionParams {
  input: string
  setInput: (value: string) => void
  resetInputField: () => void
  setLocation: (
    postalCode: string | null,
    inputFieldErrorMessage: string,
    session: Session,
    onSuccess?: () => void
  ) => Promise<void>
  errorMessage: string
  setErrorMessage: (value: string) => void
  loading: boolean
  isValidationComplete: boolean
  openRegionModal: () => void
  postalCode: string | null
}

export function useRegion(): UseRegionParams {
  const [input, setInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // State to track if validation is complete
  const [isValidationComplete, setValidationComplete] = useState(false)
  const { isValidating } = useSession()
  const prevIsValidating = useRef(isValidating)

  const { openModal: displayRegionModal } = useUI()
  const { postalCode } = sessionStore.read()

  const openRegionModal = () => {
    if (!postalCode) {
      displayRegionModal()
    }
  }

  const resetInputField = () => {
    setInput('')
    setErrorMessage('')
  }

  const setLocation = async (
    postalCode: string | undefined,
    inputFieldErrorMessage: string,
    session: Session,
    onSuccess?: () => void
  ) => {
    if (typeof postalCode !== 'string') {
      return
    }

    setLoading(true)

    try {
      const newSession = {
        ...session,
        postalCode,
        geoCoordinates: null, // Revalidate geo coordinates in API when users set a new postal code
      } as Session

      const validatedSession = await validateSession(newSession)

      sessionStore.set(validatedSession ?? newSession)
      resetInputField()
      onSuccess?.() // Execute the post-validation action (close modal, etc.)
    } catch (error) {
      setErrorMessage(inputFieldErrorMessage)
    } finally {
      setLoading(false) // Reset loading to false when validation is complete
    }
  }

  // Effect to handle when isValidating changes from true to false
  useEffect(() => {
    // Check if validation has completed (isValidating changed from true to false)
    if (prevIsValidating.current && !isValidating) {
      setValidationComplete(true)

      // If the postal code is not set and is mandatory, open the region modal
      if (deliveryPromise.enabled && deliveryPromise.mandatory) {
        openRegionModal()
      }
    }

    // Handle the case where `isValidating` is already false on mount
    if (!prevIsValidating.current && !isValidating && !isValidationComplete) {
      setValidationComplete(true)
    }

    // Update the previous value of isValidating
    prevIsValidating.current = isValidating
  }, [openRegionModal])

  return {
    input,
    setInput,
    resetInputField,
    setLocation,
    errorMessage,
    setErrorMessage,
    loading,
    isValidationComplete,
    openRegionModal,
    postalCode,
  }
}
