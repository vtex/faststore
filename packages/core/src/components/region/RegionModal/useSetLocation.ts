import { useState } from 'react'
import { sessionStore, validateSession } from 'src/sdk/session'

interface UseSetLocationReturn {
  input: string
  handleSubmit: (
    postalCode: string | undefined,
    inputFieldErrorMessage: string,
    session: any,
    closeModal?: () => void
  ) => Promise<void>
  resetInputField: () => void
  setInput: (value: string) => void
  setErrorMessage: (value: string) => void
  errorMessage: string
  loading: boolean
}

export function useSetLocation(): UseSetLocationReturn {
  const [input, setInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const resetInputField = () => {
    console.log('Resetting input and error message') // Debugging log
    setInput('')
    setErrorMessage('')
  }

  const handleSubmit = async (
    postalCode: string | undefined,
    inputFieldErrorMessage: string,
    session: any,
    closeModal?: () => void
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
      }

      console.log('New session:', newSession) // Debugging log

      const validatedSession = await validateSession(newSession)

      sessionStore.set(validatedSession ?? newSession)
      resetInputField()
      closeModal?.() // Close modal after successfully applied
    } catch (error) {
      setErrorMessage(inputFieldErrorMessage)
    } finally {
      setLoading(false) // Reset loading to false when validation is complete
    }
  }

  return {
    input,
    handleSubmit,
    resetInputField,
    setInput,
    setErrorMessage,
    errorMessage,
    loading,
  }
}
