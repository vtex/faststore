import { useState } from 'react'

interface RejectOrderVariables {
  data: {
    orderId: string
    customerEmail?: string
  }
}

export const useRejectOrder = () => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const rejectOrder = async (variables: RejectOrderVariables) => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const shouldSucceed = Math.random() > 0.9

      if (!shouldSucceed) {
        throw new Error('Failed to reject order')
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
        err instanceof Error ? err : new Error('Failed to reject order')
      setError(error)
      setLoading(false)
      throw error
    }
  }

  return {
    rejectOrder,
    data,
    error,
    loading,
  }
}
