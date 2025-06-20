import { useCallback, useState } from 'react'

import type { Session } from '@faststore/sdk'
import { deliveryPromise } from 'discovery.config'
import { getProductCount } from 'src/sdk/product'
import { sessionStore, validateSession } from 'src/sdk/session'

type SetRegionProps = {
  session: Session
  postalCode: string | undefined
  onSuccess?: () => void
  errorMessage: string
  noProductsAvailableErrorMessage?: string
}

type UseRegionValues = {
  loading: boolean
  regionError: string
  setRegion: (props: SetRegionProps) => Promise<void>
  setRegionError: (value: string) => void
}

export default function useRegion(): UseRegionValues {
  const [loading, setLoading] = useState<boolean>(false)
  const [regionError, setRegionError] = useState<string>('')

  const setRegion = async ({
    postalCode,
    errorMessage,
    session,
    onSuccess,
    noProductsAvailableErrorMessage,
  }: SetRegionProps) => {
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
        // Check product availability for specific postal code
        const productCount = await getProductCount()
        if (productCount === 0) {
          const errorFallback = `There are no products available for ${postalCode}.`
          const noProductsAvailableError =
            noProductsAvailableErrorMessage?.replace(/%s/g, () => postalCode)

          setRegionError(noProductsAvailableError ?? errorFallback)
          setLoading(false)
          return
        }
      }

      sessionStore.set(validatedSession ?? newSession)
      setRegionError('')
      onSuccess?.() // Execute the post-validation action (close modal, etc.)
    } catch (error) {
      setRegionError(errorMessage)
    } finally {
      setLoading(false) // Reset loading to false when validation is complete
    }
  }

  return {
    loading,
    setRegion,
    regionError,
    setRegionError,
  }
}
