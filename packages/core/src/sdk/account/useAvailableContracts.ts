import { gql } from '@generated'
import type {
  AvailableContractsQueryQuery,
  AvailableContractsQueryQueryVariables,
} from '@generated/graphql'

import { useQuery } from '../graphql/useQuery'
import { useSession } from '../session'

export const AvailableContractsQuery = gql(`
  query AvailableContractsQuery($orgUnitId: String!) {
    availableContracts(orgUnitId: $orgUnitId) {
      id
      corporateName
      isActive
    }
  }
`)

export type AvailableContract =
  AvailableContractsQueryQuery['availableContracts'][number]

/**
 * Lists the contracts associated with the current buyer's Organization Unit,
 * resolved to human-readable corporate names. The list is governed server-side:
 * only contracts associated with the Org Unit are ever returned (REQ-05).
 *
 * The query is gated by `enabled` so it only runs on demand (e.g. when the
 * switcher is opened), protecting performance budgets.
 */
export const useAvailableContracts = (enabled = true) => {
  const { b2b } = useSession()
  const orgUnitId = b2b?.unitId ?? ''

  const { data, error, isValidating } = useQuery<
    AvailableContractsQueryQuery,
    AvailableContractsQueryQueryVariables
  >(
    AvailableContractsQuery,
    { orgUnitId },
    { doNotRun: !enabled || !orgUnitId }
  )

  return {
    contracts: data?.availableContracts ?? [],
    loading: (enabled && !!orgUnitId && !data && !error) || isValidating,
    error: error ?? null,
  }
}
