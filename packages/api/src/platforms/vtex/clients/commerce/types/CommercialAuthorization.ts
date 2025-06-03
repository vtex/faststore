export type CommercialAuthorizationStatus = 'pending' | 'accepted' | 'denied'

export interface RuleCollection {
  id: string
  name: string
  status: CommercialAuthorizationStatus
  doId: string | null
  authorizadedEmails: string[]
  timeout: number
  notification: boolean
  orderAuthorizationId: string
  trigger: {
    condition: string
    effect: string
  }
  authorizationData: {
    requireAllApprovals: boolean
    authorizers: Array<{
      id: string
      email: string
      type: string
      authorizationDate: Date
    }>
  }
  scoreInterval: {
    accept: number
    deny: number
  }
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

export interface DimensionStatus {
  id: string
  name: string
  unitId: string
  status: CommercialAuthorizationStatus
  score: number
  priority: number
  shouldSimulate: boolean
  ruleCollection: RuleCollection[]
}

export interface CommercialAuthorizationResponse {
  id: string
  workflowInstanceId: string
  status: CommercialAuthorizationStatus
  units: string[]
  callbackEndpoint: string
  totalOrderValueDesiredBySeller: number
  marketPlacePaymentValue: number
  dimensionStatus: DimensionStatus[]
}
