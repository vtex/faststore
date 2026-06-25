import type { ContractResponse } from '../clients/commerce/Contract'
import type { StoreFrontContractSummary } from '../clients/commerce/types/StoreFront'

type ProfileNameFields = {
  firstName?: { value?: string | null } | null
  lastName?: { value?: string | null } | null
} | null

/**
 * Display name from Master Data, aligned with buyer-portal `personalDataToContract`.
 */
export const resolveContractDisplayNameFromMd = (
  contract: ContractResponse | null | undefined
): string => {
  const corporateName = (contract?.corporateName ?? '').trim()

  if (corporateName) {
    return corporateName
  }

  return (contract?.firstName ?? '').trim()
}

/**
 * Display name from buyer-portal store-front BFF contract summaries.
 */
export const resolveContractDisplayNameFromStoreFront = (
  contract: StoreFrontContractSummary | null | undefined
): string => (contract?.name ?? '').trim()

/**
 * Whether a store-front contract summary is eligible for the switcher list.
 */
export const isSwitchableStoreFrontContract = (
  contract: StoreFrontContractSummary | null | undefined
): boolean => {
  if (!contract?.id) {
    return false
  }

  const name = resolveContractDisplayNameFromStoreFront(contract)
  const email = (contract.email ?? '').trim()

  return Boolean(name && email)
}

/**
 * Whether a CL record is eligible for contract switcher summaries (attached list).
 */
export const isSwitchableContractSummary = (
  contract: ContractResponse | null | undefined
): boolean => {
  if (!contract) {
    return false
  }

  const name = resolveContractDisplayNameFromMd(contract)
  const email = (contract.email ?? '').trim()

  return Boolean(name && email)
}

/**
 * Resolves the active contract name: Master Data first, then VTEX session profile.
 * Matches `accountProfile` / buyer-portal behavior when CL lookup fails.
 */
export const resolveActiveContractDisplayName = (
  contract: ContractResponse | null | undefined,
  profile: ProfileNameFields
): string => {
  const fromMasterData = resolveContractDisplayNameFromMd(contract)

  if (fromMasterData) {
    return fromMasterData
  }

  return `${(profile?.firstName?.value ?? '').trim()} ${(profile?.lastName?.value ?? '').trim()}`.trim()
}
