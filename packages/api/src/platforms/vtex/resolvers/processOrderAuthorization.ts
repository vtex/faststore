import type { GraphqlContext } from '..'
import type {
  IProcessOrderAuthorization,
  ProcessOrderAuthorizationResponse,
} from '../../../__generated__/schema'
import {
  extractRuleForAuthorization,
  isPendingForOtherAuthorizer,
} from '../utils/commercialAuth'

export const processOrderAuthorization = async (
  _: any,
  { data }: { data: IProcessOrderAuthorization },
  { clients: { commerce } }: GraphqlContext
): Promise<ProcessOrderAuthorizationResponse | null> => {
  // Process the authorization
  const commercialAuth = await commerce.oms.processOrderAuthorization(data)

  // Extract pending authorization for current user
  const ruleForAuthorization = extractRuleForAuthorization(commercialAuth)

  // Check if there are pending authorizations for other users
  const isPendingForOther =
    !ruleForAuthorization && isPendingForOtherAuthorizer(commercialAuth)

  return {
    isPendingForOtherAuthorizer: isPendingForOther,
    ruleForAuthorization,
  }
}
