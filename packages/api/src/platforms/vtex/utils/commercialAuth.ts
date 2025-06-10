import type {
  CommercialAuthorizationResponse,
  CommercialAuthorizationRule,
} from '../clients/commerce/types/CommercialAuthorization'

export interface RuleForAuthorization extends CommercialAuthorizationRule {
  orderAuthorizationId: string
  dimensionId: string
}

/**
 * Extracts the first pending rule for authorization where the user is the next authorizer.
 * Returns null if no such rule exists or if the commercial authorization is not pending.
 */
export function extractRuleForAuthorization(
  commercialAuth: CommercialAuthorizationResponse | null | undefined
): RuleForAuthorization | null {
  if (!commercialAuth || commercialAuth.status !== 'pending') {
    return null
  }

  for (const dimension of commercialAuth.dimensionStatus) {
    if (dimension.status !== 'pending') {
      continue
    }

    const pendingRule = dimension.ruleCollection.find(
      (rule) => rule.status === 'pending'
    )

    if (pendingRule && pendingRule.isUserNextAuthorizer) {
      return {
        ...pendingRule,
        orderAuthorizationId: commercialAuth.id,
        dimensionId: dimension.id,
      }
    }
  }

  return null
}

/**
 * Checks if there are pending rules for other authorizers in the commercial authorization.
 * Returns true if all pending rules are not for the current user (i.e., the user is not the next authorizer).
 */
export function isPendingForOtherAuthorizer(
  commercialAuth: CommercialAuthorizationResponse | null | undefined
): boolean {
  if (!commercialAuth || commercialAuth.status !== 'pending') return false

  const pendingRules = commercialAuth.dimensionStatus
    .filter((dimension) => dimension.status === 'pending')
    .flatMap((dimension) => dimension.ruleCollection)
    .filter((rule) => rule.status === 'pending')

  if (pendingRules.length === 0) return false

  return pendingRules.every((rule) => !rule.isUserNextAuthorizer)
}
