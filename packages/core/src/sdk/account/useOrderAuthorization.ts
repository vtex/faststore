import { useState } from 'react'

interface ProcessOrderAuthorizationVariables {
  data: {
    orderAuthorizationId: string
    ruleId: string
    dimensionId: string
    approved: boolean
  }
}

export const useOrderAuthorization = () => {
  const [data, setData] = useState<{
    data: {
      isPendingForOtherAuthorizer: boolean
      hasNextRuleForAuthorization: boolean
    }
  }>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const processOrderAuthorization = async (
    variables: ProcessOrderAuthorizationVariables
  ) => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const shouldSucceed = Math.random() > 0.9

      if (!shouldSucceed) {
        throw new Error('Failed to process order')
      }

      const mockResponse = {
        data: {
          isPendingForOtherAuthorizer: false,
          hasNextRuleForAuthorization: false,
        },
      }

      setData(mockResponse)
      setLoading(false)

      return mockResponse
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to process order')
      setError(error)
      setLoading(false)
      throw error
    }
  }

  return {
    processOrderAuthorization,
    data,
    error,
    loading,
  }
}
