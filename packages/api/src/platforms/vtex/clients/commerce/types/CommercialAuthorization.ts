export interface CommercialAuthorizationResponse {
  id: string
  orderId: string
  workflowInstanceId: string
  status: CommercialAuthorizationStatus
  units: string[]
  callbackEndpoint: string
  totalOrderValueDesiredBySeller: number
  marketPlacePaymentValue: number
  itemCollection: CommercialAuthorizationItem[]
  additionalInfo: Record<string, string>
  dimensionStatus: CommercialAuthorizationDimensionStatus[]
  creationVersion: string
  creationEnvironment: string
  userProfileId: string
}

export type CommercialAuthorizationStatus = 'pending' | 'accepted' | 'denied'

export interface CommercialAuthorizationItem {
  id: string
  sku: string
  price: number
  totalSystemDiscount: number
  totalManualDiscount: number
  quantity: number
  additionalInfo: Record<string, string>
}

export interface CommercialAuthorizationDimensionStatus {
  id: string
  name: string
  unitId: string | null
  status: CommercialAuthorizationStatus
  score: number
  priority: number
  shouldSimulate: boolean
  ruleCollection: CommercialAuthorizationRule[]
  creationDate: string
  creationVersion: string
  creationEnvironment: string
  requireAllRulesAcceptance: boolean
}

export interface CommercialAuthorizationRule {
  id: string
  name: string
  status: CommercialAuthorizationStatus
  doId: string | null
  authorizedEmails: string[]
  priority: number
  trigger: {
    condition: {
      conditionType: number
      description?: string | null
      lessThan: number | null
      greatherThan: number | null
      expression: string | null
    }
    effect: {
      description: string | null
      effectType: number
      funcPath: string | null
    }
  }
  timeout: number
  notification: boolean
  scoreInterval: {
    accept: number
    deny: number
  }
  authorizationData: {
    requireAllApprovals: boolean
    authorizers: Array<{
      id: string
      email: string | null
      type: string
      authorizationDate: string | null
    }>
  } | null
  /**
   * Indicates that the user is listed as one of the possible approvers,
   * but does not necessarily mean that he or she is the next in the chain to approve.
   */
  isUserAuthorized: boolean
  /**
   * Indicates that the user is next in the approval chain.
   * This means that they must take an approval or rejection action.
   */
  isUserNextAuthorizer: boolean
}
