import type { ContractResponse } from '../clients/commerce/Contract'
import type {
  SessionAvailableContract,
  Shopper,
} from '../clients/commerce/types/Session'

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

const isSessionAvailableContract = (
  value: unknown
): value is SessionAvailableContract => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const contract = value as Record<string, unknown>

  return (
    typeof contract.customerId === 'string' &&
    contract.customerId.trim() !== '' &&
    typeof contract.contractName === 'string' &&
    typeof contract.isActive === 'boolean' &&
    typeof contract.isCurrent === 'boolean'
  )
}

/**
 * Parses VTEX session `shopper.availableContracts` into a typed list.
 */
export const parseSessionAvailableContracts = (
  shopper: Shopper | null | undefined
): SessionAvailableContract[] => {
  const raw = shopper?.availableContracts?.value

  if (!Array.isArray(raw)) {
    return []
  }

  return raw.filter(isSessionAvailableContract)
}

/**
 * Whether a session contract is eligible for the switcher list.
 */
export const isSwitchableSessionContract = (
  contract: SessionAvailableContract | null | undefined
): boolean => {
  if (!contract?.customerId) {
    return false
  }

  const name = (contract.contractName ?? '').trim()

  return Boolean(name && contract.isActive)
}

/**
 * Resolves the active contract id from VTEX session namespaces.
 */
export const resolveActiveContractIdFromSession = (
  sessionData: {
    namespaces?: {
      shopper?: Shopper | null
      authentication?: { customerId?: { value?: string | null } | null } | null
      profile?: { id?: { value?: string | null } | null } | null
    } | null
  } | null
): string => {
  return (
    sessionData?.namespaces?.shopper?.activeContractId?.value?.trim() ??
    sessionData?.namespaces?.authentication?.customerId?.value?.trim() ??
    sessionData?.namespaces?.profile?.id?.value?.trim() ??
    ''
  )
}

/**
 * Maps session contracts to GraphQL `StoreContract` entries.
 */
export const mapSessionContractsToStoreContracts = (
  contracts: SessionAvailableContract[],
  activeContractId = ''
): Array<{ id: string; corporateName: string; isActive: boolean }> => {
  const normalizedActiveId = activeContractId.trim()

  return contracts.filter(isSwitchableSessionContract).map((contract) => ({
    id: contract.customerId,
    corporateName: contract.contractName.trim(),
    isActive: normalizedActiveId
      ? contract.customerId === normalizedActiveId
      : contract.isCurrent,
  }))
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

  return (profile?.firstName?.value ?? '').trim()
}
