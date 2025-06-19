import { useState, useEffect } from 'react'

export interface CommercialAuthorizationRule {
  ruleId: string
  ruleName: string
  dimensionId: string
  dimensionName: string
  status: 'pending' | 'accepted' | 'denied'
  isUserAuthorized: boolean
  isUserNextAuthorizer: boolean
  score?: number
  buyingPolicy?: {
    title: string
    description: string
    details?: string[]
  }
}

export interface CommercialAuthorizationDimension {
  dimensionId: string
  dimensionName: string
  status: 'pending' | 'accepted' | 'denied'
  rules: CommercialAuthorizationRule[]
}

export interface CommercialAuthorizationData {
  orderAuthorizationId: string
  orderId: string
  status: 'pending' | 'accepted' | 'denied'
  dimensions: CommercialAuthorizationDimension[]
}

interface UseCommercialAuthorizationReturn {
  authorizationData: CommercialAuthorizationData | null
  currentRule: CommercialAuthorizationRule | null
  hasNextRule: boolean
  canUserApprove: boolean
  hasOtherPendingPolicies: boolean
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  processApproval: (ruleId: string, dimensionId: string) => Promise<void>
  processRejection: (ruleId: string, dimensionId: string) => Promise<void>
}

export const useCommercialAuthorization = (
  orderId: string
): UseCommercialAuthorizationReturn => {
  const [authorizationData, setAuthorizationData] =
    useState<CommercialAuthorizationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [processingAction, setProcessingAction] = useState(false)

  // Simulated fetch function - replace with actual API call
  const fetchAuthorizationData = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/${account}/commercial-authorizations/${orderId}`)
      // const data = await response.json()

      // Mock data for demonstration
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockData: CommercialAuthorizationData = {
        orderAuthorizationId: `auth-${orderId}`,
        orderId,
        status: 'pending',
        dimensions: [
          {
            dimensionId: 'spending-limit',
            dimensionName: 'Standard Spending Limit',
            status: 'pending',
            rules: [
              {
                ruleId: 'rule-1000',
                ruleName: 'Orders over $1,000 require approval',
                dimensionId: 'spending-limit',
                dimensionName: 'Standard Spending Limit',
                status: 'pending',
                isUserAuthorized: true,
                isUserNextAuthorizer: true,
                buyingPolicy: {
                  title: 'Standard spending limit policy',
                  description:
                    'Orders over $1,000 require review and approval.',
                  details: [
                    'This policy ensures proper oversight of high-value purchases',
                    'Approval is required before the order can proceed',
                    'Manager authorization needed for compliance',
                  ],
                },
              },
            ],
          },
        ],
      }

      setAuthorizationData(mockData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch authorization data')
      )
    } finally {
      setLoading(false)
    }
  }

  // Process callback for approval/rejection
  const processCallback = async (
    ruleId: string,
    dimensionId: string,
    score: number
  ): Promise<void> => {
    if (!authorizationData || processingAction) return

    setProcessingAction(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(
      //   `/api/${accountName}/commercial-authorizations/${authorizationData.orderAuthorizationId}/callback`,
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       params: { dimensionId, ruleId, score }
      //     })
      //   }
      // )

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simulate success/failure
      const shouldSucceed = Math.random() > 0.1
      if (!shouldSucceed) {
        throw new Error('Failed to process authorization')
      }

      // Refetch data after successful action
      await fetchAuthorizationData()
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error('Failed to process authorization')
    } finally {
      setProcessingAction(false)
    }
  }

  const processApproval = async (
    ruleId: string,
    dimensionId: string
  ): Promise<void> => {
    return processCallback(ruleId, dimensionId, 100)
  }

  const processRejection = async (
    ruleId: string,
    dimensionId: string
  ): Promise<void> => {
    return processCallback(ruleId, dimensionId, 0)
  }

  // Get current rule that user can approve
  const getCurrentRule = (): CommercialAuthorizationRule | null => {
    if (!authorizationData || authorizationData.status !== 'pending') {
      return null
    }

    for (const dimension of authorizationData.dimensions) {
      if (dimension.status === 'pending') {
        for (const rule of dimension.rules) {
          if (rule.status === 'pending' && rule.isUserNextAuthorizer) {
            return rule
          }
        }
      }
    }

    return null
  }

  // Check if there are more rules after current one
  const checkHasNextRule = (): boolean => {
    if (!authorizationData) return false

    let foundCurrent = false

    for (const dimension of authorizationData.dimensions) {
      for (const rule of dimension.rules) {
        if (foundCurrent && rule.status === 'pending') {
          return true
        }
        if (rule.status === 'pending' && rule.isUserNextAuthorizer) {
          foundCurrent = true
        }
      }
    }

    return false
  }

  // Check if user can approve any rule
  const checkCanUserApprove = (): boolean => {
    return getCurrentRule() !== null
  }

  // Check if there are other pending policies (not for current user)
  const checkHasOtherPendingPolicies = (): boolean => {
    if (!authorizationData || authorizationData.status !== 'pending') {
      return false
    }

    for (const dimension of authorizationData.dimensions) {
      if (dimension.status === 'pending') {
        for (const rule of dimension.rules) {
          if (rule.status === 'pending' && !rule.isUserNextAuthorizer) {
            return true
          }
        }
      }
    }

    return false
  }

  useEffect(() => {
    if (orderId) {
      fetchAuthorizationData()
    }
  }, [orderId])

  return {
    authorizationData,
    currentRule: getCurrentRule(),
    hasNextRule: checkHasNextRule(),
    canUserApprove: checkCanUserApprove(),
    hasOtherPendingPolicies: checkHasOtherPendingPolicies(),
    loading,
    error,
    refetch: fetchAuthorizationData,
    processApproval,
    processRejection,
  }
}
