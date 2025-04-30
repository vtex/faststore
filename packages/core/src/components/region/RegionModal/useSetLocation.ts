import { useState } from 'react'

import type { Session } from '@faststore/sdk'
import { sessionStore, validateSession } from 'src/sdk/session'
import { getProductCount } from 'src/sdk/product'
import { deliveryPromise } from 'discovery.config'

interface UseSetLocationParams {
  input: string
  setInput: (value: string) => void
  resetInputField: () => void
  setLocation: (
    postalCode: string | undefined,
    inputFieldErrorMessage: string,
    session: Session,
    onSuccess?: () => void
  ) => Promise<void>
  errorMessage: string
  setErrorMessage: (value: string) => void
  loading: boolean
}

export function useSetLocation(): UseSetLocationParams {
  const [input, setInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

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

      if (deliveryPromise.enabled) {
        // Check product availability for specific location
        const productCount = await getProductCount()
        if (productCount === 0) {
          setErrorMessage(`There are no products available for ${postalCode}.`)
          setLoading(false)
          return
        }
      }

      sessionStore.set(validatedSession ?? newSession)
      resetInputField()
      onSuccess?.() // Execute the post-validation action (close modal, etc.)
    } catch (error) {
      setErrorMessage(inputFieldErrorMessage)
    } finally {
      setLoading(false) // Reset loading to false when validation is complete
    }
  }

  return {
    input,
    setInput,
    resetInputField,
    setLocation,
    errorMessage,
    setErrorMessage,
    loading,
  }
}
