export interface DelegationIdentifier {
  type: string
  value: string
}

/** Item of the `grantee` list returned by the Authenticator delegations API. */
export interface GranteeDelegation {
  delegationId: string
  organizationUnitId: string
  granteeUserId: string
  identifiers: DelegationIdentifier[]
  startDate: string
  endDate?: string | null
}

/** Item of the `granter` list: users the logged-in user can act on behalf of. */
export interface GranterDelegation {
  delegationId: string
  organizationUnitId: string
  granterUserId: string
  identifiers: DelegationIdentifier[]
  startDate: string
  endDate?: string | null
}

export interface DelegationsResponse {
  grantee?: GranteeDelegation[]
  granter?: GranterDelegation[]
}

export interface CreateDelegationBody {
  organizationUnitId: string
  originalUserId: string
  delegateUserId: string
  startDate: string
  endDate?: string
}

export interface UpdateDelegationBody {
  revoke?: true
  startDate?: string
  endDate?: string
}

export interface OrgUnitUser {
  userId: string
  identifiers: string[]
  organizationUnitId: string
}

export interface OrgUnitUsersResponse {
  items: OrgUnitUser[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
