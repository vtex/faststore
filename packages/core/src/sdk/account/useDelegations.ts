import { gql } from '@generated'
import type {
  CompareDelegateRolesQueryQuery,
  CompareDelegateRolesQueryQueryVariables,
  CreateDelegationMutationMutation,
  CreateDelegationMutationMutationVariables,
  ListDelegateCandidatesQueryQuery,
  ListDelegationsQueryQuery,
  RevokeDelegationMutationMutation,
  RevokeDelegationMutationMutationVariables,
  UpdateDelegationMutationMutation,
  UpdateDelegationMutationMutationVariables,
} from '@generated/graphql'

import { request } from '../graphql/request'
import { useQuery } from '../graphql/useQuery'

export const ListDelegationsQuery = gql(`
  query ListDelegationsQuery {
    listDelegations {
      grantee {
        id
        granteeUserId
        granteeUsername
        granteeEmail
        startDate
        endDate
      }
      granter {
        id
        granterUserId
        granterUsername
        granterEmail
        startDate
        endDate
      }
    }
  }
`)

export const ListDelegateCandidatesQuery = gql(`
  query ListDelegateCandidatesQuery {
    listDelegateCandidates {
      userId
      username
      email
    }
  }
`)

export const CompareDelegateRolesQuery = gql(`
  query CompareDelegateRolesQuery($delegateUserId: String!) {
    compareDelegateRoles(delegateUserId: $delegateUserId) {
      hasFewerRoles
    }
  }
`)

export const CreateDelegationMutation = gql(`
  mutation CreateDelegationMutation($data: IStoreCreateDelegation!) {
    createDelegation(data: $data)
  }
`)

export const UpdateDelegationMutation = gql(`
  mutation UpdateDelegationMutation($id: ID!, $data: IStoreUpdateDelegation!) {
    updateDelegation(id: $id, data: $data)
  }
`)

export const RevokeDelegationMutation = gql(`
  mutation RevokeDelegationMutation($id: ID!) {
    revokeDelegation(id: $id)
  }
`)

/**
 * Delegations of the logged-in buyer: `delegations` are the ones they granted
 * (who can act on their behalf) and `actingFor` the ones granted to them.
 */
export const useDelegations = () => {
  const { data, error, mutate } = useQuery<ListDelegationsQueryQuery>(
    ListDelegationsQuery,
    {},
    { dedupingInterval: 0 }
  )

  return {
    delegations: data?.listDelegations.grantee ?? [],
    actingFor: data?.listDelegations.granter ?? [],
    loading: !data && !error,
    error: error ?? null,
    refresh: () => mutate(),
  }
}

/** Users of the buyer's organization who can be elected as Delegate. */
export const useDelegateCandidates = (enabled: boolean) => {
  const { data } = useQuery<ListDelegateCandidatesQueryQuery>(
    ListDelegateCandidatesQuery,
    {},
    { doNotRun: !enabled, dedupingInterval: 0 }
  )

  return { candidates: data?.listDelegateCandidates ?? [] }
}

/** Whether the user about to be elected holds fewer roles than the buyer. */
export const useDelegateRoleComparison = (
  delegateUserId: string,
  enabled: boolean
) => {
  const { data } = useQuery<
    CompareDelegateRolesQueryQuery,
    CompareDelegateRolesQueryQueryVariables
  >(
    CompareDelegateRolesQuery,
    { delegateUserId },
    { doNotRun: !enabled || !delegateUserId, dedupingInterval: 0 }
  )

  return { hasFewerRoles: data?.compareDelegateRoles.hasFewerRoles ?? false }
}

export const createDelegation = (
  data: CreateDelegationMutationMutationVariables['data']
) =>
  request<
    CreateDelegationMutationMutation,
    CreateDelegationMutationMutationVariables
  >(CreateDelegationMutation, { data })

export const updateDelegation = (
  id: string,
  data: UpdateDelegationMutationMutationVariables['data']
) =>
  request<
    UpdateDelegationMutationMutation,
    UpdateDelegationMutationMutationVariables
  >(UpdateDelegationMutation, { id, data })

export const revokeDelegation = (id: string) =>
  request<
    RevokeDelegationMutationMutation,
    RevokeDelegationMutationMutationVariables
  >(RevokeDelegationMutation, { id })
