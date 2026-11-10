import type { GraphqlContext } from '..'
import type {
  MutationCreateDelegationArgs,
  MutationRevokeDelegationArgs,
  MutationUpdateDelegationArgs,
  QueryCompareDelegateRolesArgs,
  StoreDelegateCandidate,
  StoreDelegateRoleComparison,
  StoreDelegation,
  StoreDelegationsResult,
  StoreGrantedDelegation,
} from '../../../__generated__/schema'
import { BadRequestError, ForbiddenError } from '../../errors'
import type {
  DelegationIdentifier,
  GranteeDelegation,
  GranterDelegation,
} from '../clients/commerce/types/Delegation'
import { getAuthCookie, parseJwt } from '../utils/cookies'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * The Authenticator API requires an end date, so an open-ended delegation is
 * stored with this far-away date. It is exposed to the storefront as `null`.
 */
const INDEFINITE_END_DATE = '9999-12-31'

const normalizeEndDate = (endDate?: string | null) =>
  !endDate || endDate >= INDEFINITE_END_DATE ? null : endDate
// Safety cap for the organization users pagination.
const MAX_CANDIDATE_PAGES = 20

/**
 * Identity of the authenticated buyer, always read from the auth cookie on the
 * server. It is never taken from the request arguments.
 */
const getSessionUser = (ctx: GraphqlContext) => {
  const { account, headers } = ctx
  const jwt = parseJwt(getAuthCookie(headers?.cookie ?? '', account))
  const userId: string = jwt?.userId ?? ''
  const unitId: string = jwt?.unitId ?? ''

  if (!userId) {
    throw new ForbiddenError('Unable to identify the authenticated user.')
  }

  return { userId, unitId }
}

const findIdentifier = (
  identifiers: DelegationIdentifier[] | undefined,
  type: string
) => identifiers?.find((identifier) => identifier.type === type)?.value ?? null

const mapDelegation = (delegation: GranteeDelegation): StoreDelegation => ({
  id: delegation.delegationId,
  granteeUserId: delegation.granteeUserId,
  granteeUsername: findIdentifier(delegation.identifiers, 'username'),
  granteeEmail: findIdentifier(delegation.identifiers, 'email'),
  startDate: delegation.startDate,
  endDate: normalizeEndDate(delegation.endDate),
})

const mapGrantedDelegation = (
  delegation: GranterDelegation
): StoreGrantedDelegation => ({
  id: delegation.delegationId,
  granterUserId: delegation.granterUserId,
  granterUsername: findIdentifier(delegation.identifiers, 'username'),
  granterEmail: findIdentifier(delegation.identifiers, 'email'),
  startDate: delegation.startDate,
  endDate: normalizeEndDate(delegation.endDate),
})

const validatePeriod = (startDate?: string | null, endDate?: string | null) => {
  if (startDate && !DATE_PATTERN.test(startDate)) {
    throw new BadRequestError('startDate must use the YYYY-MM-DD format.')
  }

  if (endDate && !DATE_PATTERN.test(endDate)) {
    throw new BadRequestError('endDate must use the YYYY-MM-DD format.')
  }

  if (startDate && endDate && endDate < startDate) {
    throw new BadRequestError('endDate must not be earlier than startDate.')
  }
}

/**
 * Guarantees that the delegation belongs to the authenticated buyer (listed in
 * their `grantee` list, i.e. they are the Original Shopper) before any change,
 * even if the id was forged.
 */
const assertOwnDelegation = async (
  ctx: GraphqlContext,
  userId: string,
  delegationId: string
) => {
  if (!delegationId) {
    throw new BadRequestError('Missing delegation id.')
  }

  const response = await ctx.clients.commerce.delegations.list({ userId })
  const owned = (response?.grantee ?? []).some(
    (delegation) => delegation.delegationId === delegationId
  )

  if (!owned) {
    throw new ForbiddenError('The delegation does not belong to the user.')
  }
}

export const listDelegations = async (
  _: unknown,
  __: unknown,
  ctx: GraphqlContext
): Promise<StoreDelegationsResult> => {
  const { userId } = getSessionUser(ctx)
  const response = await ctx.clients.commerce.delegations.list({ userId })

  return {
    grantee: (response?.grantee ?? []).map(mapDelegation),
    granter: (response?.granter ?? []).map(mapGrantedDelegation),
  }
}

export const listDelegateCandidates = async (
  _: unknown,
  __: unknown,
  ctx: GraphqlContext
): Promise<StoreDelegateCandidate[]> => {
  const { userId, unitId } = getSessionUser(ctx)

  if (!unitId) {
    throw new ForbiddenError(
      'The user does not belong to an organization unit.'
    )
  }

  const { listOrgUnitUsers } = ctx.clients.commerce.delegations
  const candidates: StoreDelegateCandidate[] = []
  let page = 1
  let totalPages = 1

  do {
    const response = await listOrgUnitUsers({ unitId, page })

    for (const user of response?.items ?? []) {
      if (user.userId === userId) {
        continue
      }

      const identifiers = user.identifiers ?? []

      candidates.push({
        userId: user.userId,
        username: identifiers.find((value) => !value.includes('@')) ?? null,
        email: identifiers.find((value) => value.includes('@')) ?? null,
      })
    }

    totalPages = response?.totalPages ?? 1
    page += 1
  } while (page <= totalPages && page <= MAX_CANDIDATE_PAGES)

  return candidates
}

export const compareDelegateRoles = async (
  _: unknown,
  { delegateUserId }: QueryCompareDelegateRolesArgs,
  ctx: GraphqlContext
): Promise<StoreDelegateRoleComparison> => {
  const { userId } = getSessionUser(ctx)

  if (!delegateUserId) {
    throw new BadRequestError('Missing delegateUserId.')
  }

  if (delegateUserId === userId) {
    throw new BadRequestError('A user cannot delegate to themselves.')
  }

  const { licenseManager } = ctx.clients.commerce
  const readRoles = (id: string, who: 'buyer' | 'delegate') =>
    licenseManager.getUserRoles({ userId: id }).catch((error: Error) => {
      // The warning is optional: only the reason is logged, never ids or tokens.
      console.warn(
        `compareDelegateRoles: could not read the ${who} roles: ${error?.message}`
      )

      return null
    })

  const [buyerRoles, delegateRoles] = await Promise.all([
    readRoles(userId, 'buyer'),
    readRoles(delegateUserId, 'delegate'),
  ])

  // The warning is informative only: when a side cannot be read, say nothing.
  if (!buyerRoles?.Roles || !delegateRoles?.Roles) {
    return { hasFewerRoles: false }
  }

  const buyerRoleIds = new Set(buyerRoles.Roles.map((role) => role.Id))
  const delegateRoleIds = new Set(delegateRoles.Roles.map((role) => role.Id))

  // Strict subset: every Delegate role is a buyer role, and the buyer has more.
  const isStrictSubset =
    delegateRoleIds.size < buyerRoleIds.size &&
    [...delegateRoleIds].every((id) => buyerRoleIds.has(id))

  return { hasFewerRoles: isStrictSubset }
}

export const createDelegation = async (
  _: unknown,
  { data }: MutationCreateDelegationArgs,
  ctx: GraphqlContext
): Promise<boolean> => {
  const { userId, unitId } = getSessionUser(ctx)

  if (!data?.delegateUserId) {
    throw new BadRequestError('Missing delegateUserId.')
  }

  if (data.delegateUserId === userId) {
    throw new BadRequestError('A user cannot delegate to themselves.')
  }

  if (!unitId) {
    throw new ForbiddenError(
      'The user does not belong to an organization unit.'
    )
  }

  validatePeriod(data.startDate, data.endDate)

  await ctx.clients.commerce.delegations.create({
    organizationUnitId: unitId,
    originalUserId: userId,
    delegateUserId: data.delegateUserId,
    startDate: data.startDate,
    endDate: data.endDate || INDEFINITE_END_DATE,
  })

  return true
}

export const updateDelegation = async (
  _: unknown,
  { id, data }: MutationUpdateDelegationArgs,
  ctx: GraphqlContext
): Promise<boolean> => {
  const { userId } = getSessionUser(ctx)

  validatePeriod(data?.startDate, data?.endDate)

  // An empty string removes the end date; `null` leaves it untouched.
  const clearsEndDate = data?.endDate === ''

  if (!data?.startDate && !data?.endDate && !clearsEndDate) {
    throw new BadRequestError(
      'Nothing to update: provide startDate or endDate.'
    )
  }

  await assertOwnDelegation(ctx, userId, id)

  await ctx.clients.commerce.delegations.update({
    delegationId: id,
    body: {
      ...(data.startDate ? { startDate: data.startDate } : {}),
      ...(data.endDate ? { endDate: data.endDate } : {}),
      ...(clearsEndDate ? { endDate: INDEFINITE_END_DATE } : {}),
    },
  })

  return true
}

export const revokeDelegation = async (
  _: unknown,
  { id }: MutationRevokeDelegationArgs,
  ctx: GraphqlContext
): Promise<boolean> => {
  const { userId } = getSessionUser(ctx)

  await assertOwnDelegation(ctx, userId, id)

  await ctx.clients.commerce.delegations.update({
    delegationId: id,
    body: { revoke: true },
  })

  return true
}
