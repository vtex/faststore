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
   * Indica que o usuário está listado como um dos possíveis aprovadores,
   * mas não necessariamente significa que ele é o próximo da cadeia a aprovar.
   */
  isUserAuthorized: boolean
  /**
   * Indica que o usuário é o próximo na cadeia de aprovação.
   * Isso significa que ele deve tomar uma ação de aprovação ou rejeição.
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
