import { useState } from 'react'

interface ApproveOrderVariables {
  data: {
    orderId: string
    customerEmail?: string
  }
}

export const useApproveOrder = () => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  // TODO: Replace with actual GraphQL mutation when its ready
  const approveOrder = async (variables: ApproveOrderVariables) => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const shouldSucceed = Math.random() > 0.1
      if (!shouldSucceed) {
        throw new Error('Failed to approve order')
      }

      const mockResponse = {
        data: {
          success: true,
          orderId: variables.data.orderId,
        },
      }

      setData(mockResponse)
      setLoading(false)

      return mockResponse
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to approve order')
      setError(error)
      setLoading(false)
      throw error
    }
  }

  return {
    approveOrder,
    data,
    error,
    loading,
  }
}
