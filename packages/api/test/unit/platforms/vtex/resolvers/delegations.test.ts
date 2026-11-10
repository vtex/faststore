import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  compareDelegateRoles,
  createDelegation,
  listDelegateCandidates,
  listDelegations,
  revokeDelegation,
  updateDelegation,
} from '../../../../../src/platforms/vtex/resolvers/delegations'

const ACCOUNT = 'b2bstore'

const makeCookie = (claims: Record<string, unknown> | null) => {
  if (!claims) {
    return ''
  }

  const payload = Buffer.from(JSON.stringify(claims)).toString('base64')

  return `VtexIdclientAutCookie_${ACCOUNT}=header.${payload}.signature`
}

const makeContext = (claims: Record<string, unknown> | null) => {
  const delegations = {
    list: vi.fn(),
    create: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
    listOrgUnitUsers: vi.fn(),
  }
  const licenseManager = { getUserRoles: vi.fn() }

  return {
    delegations,
    licenseManager,
    ctx: {
      account: ACCOUNT,
      headers: { cookie: makeCookie(claims) },
      clients: { commerce: { delegations, licenseManager } },
    } as any,
  }
}

const buyer = { userId: 'buyer-1', unitId: 'unit-1' }

const grantee = (overrides: Record<string, unknown> = {}) => ({
  delegationId: 'del-1',
  organizationUnitId: 'unit-1',
  granteeUserId: 'user-2',
  identifiers: [
    { type: 'username', value: 'jane' },
    { type: 'email', value: 'jane@acme.com' },
  ],
  startDate: '2026-11-10',
  endDate: '2026-12-03',
  ...overrides,
})

const granter = (overrides: Record<string, unknown> = {}) => ({
  delegationId: 'gr-1',
  organizationUnitId: 'unit-1',
  granterUserId: 'user-9',
  identifiers: [
    { type: 'username', value: 'pburgos' },
    { type: 'email', value: 'p@acme.com' },
  ],
  startDate: '2026-07-08',
  endDate: '2026-08-08',
  ...overrides,
})

describe('listDelegations', () => {
  it('maps both lists of the authenticated buyer', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({
      grantee: [grantee(), grantee({ delegationId: 'del-2', endDate: null })],
      granter: [granter(), granter({ delegationId: 'gr-2', endDate: null })],
    })

    const result = await listDelegations(null, {}, ctx)

    expect(delegations.list).toHaveBeenCalledWith({ userId: 'buyer-1' })
    expect(result).toEqual({
      grantee: [
        {
          id: 'del-1',
          granteeUserId: 'user-2',
          granteeUsername: 'jane',
          granteeEmail: 'jane@acme.com',
          startDate: '2026-11-10',
          endDate: '2026-12-03',
        },
        {
          id: 'del-2',
          granteeUserId: 'user-2',
          granteeUsername: 'jane',
          granteeEmail: 'jane@acme.com',
          startDate: '2026-11-10',
          endDate: null,
        },
      ],
      granter: [
        {
          id: 'gr-1',
          granterUserId: 'user-9',
          granterUsername: 'pburgos',
          granterEmail: 'p@acme.com',
          startDate: '2026-07-08',
          endDate: '2026-08-08',
        },
        {
          id: 'gr-2',
          granterUserId: 'user-9',
          granterUsername: 'pburgos',
          granterEmail: 'p@acme.com',
          startDate: '2026-07-08',
          endDate: null,
        },
      ],
    })
  })

  it('returns null username/email when the identifiers are missing', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({
      grantee: [grantee({ identifiers: undefined })],
      granter: [granter({ identifiers: undefined })],
    })

    const result = await listDelegations(null, {}, ctx)

    expect(result.grantee[0].granteeUsername).toBeNull()
    expect(result.grantee[0].granteeEmail).toBeNull()
    expect(result.granter[0].granterUsername).toBeNull()
    expect(result.granter[0].granterEmail).toBeNull()
  })

  it('returns empty lists when the response has none', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({})

    await expect(listDelegations(null, {}, ctx)).resolves.toEqual({
      grantee: [],
      granter: [],
    })
  })

  it('rejects when the user cannot be identified from the auth cookie', async () => {
    const { ctx, delegations } = makeContext(null)

    await expect(listDelegations(null, {}, ctx)).rejects.toMatchObject({
      extensions: { status: 403, type: 'ForbiddenError' },
    })
    expect(delegations.list).not.toHaveBeenCalled()
  })
})

describe('listDelegateCandidates', () => {
  it('lists the organization users without the authenticated buyer, across pages', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.listOrgUnitUsers
      .mockResolvedValueOnce({
        items: [
          {
            userId: 'buyer-1',
            identifiers: ['me', 'me@acme.com'],
            organizationUnitId: 'unit-1',
          },
          {
            userId: 'user-2',
            identifiers: ['jane', 'jane@acme.com'],
            organizationUnitId: 'unit-1',
          },
        ],
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        items: [
          {
            userId: 'user-3',
            identifiers: ['sam@acme.com'],
            organizationUnitId: 'unit-2',
          },
          { userId: 'user-4', identifiers: [], organizationUnitId: 'unit-2' },
        ],
        totalPages: 2,
      })

    const result = await listDelegateCandidates(null, {}, ctx)

    expect(delegations.listOrgUnitUsers).toHaveBeenNthCalledWith(1, {
      unitId: 'unit-1',
      page: 1,
    })
    expect(delegations.listOrgUnitUsers).toHaveBeenNthCalledWith(2, {
      unitId: 'unit-1',
      page: 2,
    })
    expect(result).toEqual([
      { userId: 'user-2', username: 'jane', email: 'jane@acme.com' },
      { userId: 'user-3', username: null, email: 'sam@acme.com' },
      { userId: 'user-4', username: null, email: null },
    ])
  })

  it('stops after the page cap even if the API reports more pages', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.listOrgUnitUsers.mockResolvedValue({
      items: [],
      totalPages: 500,
    })

    await listDelegateCandidates(null, {}, ctx)

    expect(delegations.listOrgUnitUsers).toHaveBeenCalledTimes(20)
  })

  it('handles an empty response', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.listOrgUnitUsers.mockResolvedValueOnce(undefined)

    await expect(listDelegateCandidates(null, {}, ctx)).resolves.toEqual([])
    expect(delegations.listOrgUnitUsers).toHaveBeenCalledTimes(1)
  })

  it('rejects when the buyer has no organization unit', async () => {
    const { ctx, delegations } = makeContext({ userId: 'buyer-1' })

    await expect(listDelegateCandidates(null, {}, ctx)).rejects.toMatchObject({
      extensions: { status: 403 },
    })
    expect(delegations.listOrgUnitUsers).not.toHaveBeenCalled()
  })
})

describe('createDelegation', () => {
  const data = {
    delegateUserId: 'user-2',
    startDate: '2026-11-10',
    endDate: '2026-12-03',
  }

  it('creates the delegation with the buyer as original user and the unit from the session', async () => {
    const { ctx, delegations } = makeContext(buyer)

    const result = await createDelegation(null, { data }, ctx)

    expect(result).toBe(true)
    expect(delegations.create).toHaveBeenCalledWith({
      organizationUnitId: 'unit-1',
      originalUserId: 'buyer-1',
      delegateUserId: 'user-2',
      startDate: '2026-11-10',
      endDate: '2026-12-03',
    })
  })

  it('omits endDate for an open-ended delegation', async () => {
    const { ctx, delegations } = makeContext(buyer)

    await createDelegation(
      null,
      { data: { delegateUserId: 'user-2', startDate: '2026-11-10' } },
      ctx
    )

    expect(delegations.create).toHaveBeenCalledWith({
      organizationUnitId: 'unit-1',
      originalUserId: 'buyer-1',
      delegateUserId: 'user-2',
      startDate: '2026-11-10',
    })
  })

  it('accepts a single-day delegation (endDate equal to startDate)', async () => {
    const { ctx, delegations } = makeContext(buyer)

    await createDelegation(
      null,
      { data: { ...data, startDate: '2026-11-10', endDate: '2026-11-10' } },
      ctx
    )

    expect(delegations.create).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['endDate earlier than startDate', { endDate: '2026-11-09' }],
    ['startDate with a wrong format', { startDate: '10/11/2026' }],
    ['endDate with a wrong format', { endDate: '2026-12-3' }],
    ['a missing delegate', { delegateUserId: '' }],
    ['the buyer as delegate', { delegateUserId: 'buyer-1' }],
  ])('rejects %s without calling the API', async (_, override) => {
    const { ctx, delegations } = makeContext(buyer)

    await expect(
      createDelegation(null, { data: { ...data, ...override } }, ctx)
    ).rejects.toMatchObject({ extensions: { status: 400 } })
    expect(delegations.create).not.toHaveBeenCalled()
  })

  it('rejects when the buyer has no organization unit', async () => {
    const { ctx, delegations } = makeContext({ userId: 'buyer-1' })

    await expect(createDelegation(null, { data }, ctx)).rejects.toMatchObject({
      extensions: { status: 403 },
    })
    expect(delegations.create).not.toHaveBeenCalled()
  })

  it('propagates a failure of the Identity API', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.create.mockRejectedValueOnce(new Error('identity down'))

    await expect(createDelegation(null, { data }, ctx)).rejects.toThrow(
      'identity down'
    )
  })
})

describe('updateDelegation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends only the changed dates of a delegation owned by the buyer', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({ grantee: [grantee()] })

    const result = await updateDelegation(
      null,
      { id: 'del-1', data: { endDate: '2026-12-10' } },
      ctx
    )

    expect(result).toBe(true)
    expect(delegations.update).toHaveBeenCalledWith({
      delegationId: 'del-1',
      body: { endDate: '2026-12-10' },
    })
  })

  it('can change both dates at once', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({ grantee: [grantee()] })

    await updateDelegation(
      null,
      { id: 'del-1', data: { startDate: '2026-11-11', endDate: '2026-11-20' } },
      ctx
    )

    expect(delegations.update).toHaveBeenCalledWith({
      delegationId: 'del-1',
      body: { startDate: '2026-11-11', endDate: '2026-11-20' },
    })
  })

  it('rejects a delegation that is not in the buyer list (forged id)', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({ grantee: [grantee()] })

    await expect(
      updateDelegation(
        null,
        { id: 'someone-elses', data: { endDate: '2026-12-10' } },
        ctx
      )
    ).rejects.toMatchObject({ extensions: { status: 403 } })
    expect(delegations.update).not.toHaveBeenCalled()
  })

  it('rejects when the buyer has no delegations at all', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({})

    await expect(
      updateDelegation(
        null,
        { id: 'del-1', data: { endDate: '2026-12-10' } },
        ctx
      )
    ).rejects.toMatchObject({ extensions: { status: 403 } })
  })

  it.each([
    ['no dates', {}],
    [
      'endDate earlier than startDate',
      { startDate: '2026-12-10', endDate: '2026-12-09' },
    ],
    ['a wrong date format', { endDate: 'tomorrow' }],
  ])('rejects %s without calling the API', async (_, data) => {
    const { ctx, delegations } = makeContext(buyer)

    await expect(
      updateDelegation(null, { id: 'del-1', data }, ctx)
    ).rejects.toMatchObject({ extensions: { status: 400 } })
    expect(delegations.list).not.toHaveBeenCalled()
    expect(delegations.update).not.toHaveBeenCalled()
  })

  it('rejects a missing delegation id', async () => {
    const { ctx, delegations } = makeContext(buyer)

    await expect(
      updateDelegation(null, { id: '', data: { endDate: '2026-12-10' } }, ctx)
    ).rejects.toMatchObject({ extensions: { status: 400 } })
    expect(delegations.update).not.toHaveBeenCalled()
  })
})

describe('revokeDelegation', () => {
  it('revokes a delegation owned by the buyer, sending no dates', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({ grantee: [grantee()] })

    const result = await revokeDelegation(null, { id: 'del-1' }, ctx)

    expect(result).toBe(true)
    expect(delegations.update).toHaveBeenCalledWith({
      delegationId: 'del-1',
      body: { revoke: true },
    })
  })

  it('rejects a delegation that does not belong to the buyer', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce({ grantee: [grantee()] })

    await expect(
      revokeDelegation(null, { id: 'forged' }, ctx)
    ).rejects.toMatchObject({ extensions: { status: 403 } })
    expect(delegations.update).not.toHaveBeenCalled()
  })
})

describe('compareDelegateRoles', () => {
  const roles = (...ids: number[]) => ({
    Email: 'x@acme.com',
    Roles: ids.map((Id) => ({ Id, Name: `role-${Id}` })),
  })

  const setup = (buyerRoles: unknown, delegateRoles: unknown) => {
    const made = makeContext(buyer)

    made.licenseManager.getUserRoles.mockImplementation(
      async ({ userId }: { userId: string }) => {
        const result = userId === 'buyer-1' ? buyerRoles : delegateRoles

        if (result instanceof Error) {
          throw result
        }

        return result
      }
    )

    return made
  }

  it('flags a Delegate whose roles are a strict subset of the buyer roles', async () => {
    const { ctx, licenseManager } = setup(roles(1, 2, 3), roles(1, 2))

    await expect(
      compareDelegateRoles(null, { delegateUserId: 'user-2' }, ctx)
    ).resolves.toEqual({ hasFewerRoles: true })
    expect(licenseManager.getUserRoles).toHaveBeenCalledWith({
      userId: 'buyer-1',
    })
    expect(licenseManager.getUserRoles).toHaveBeenCalledWith({
      userId: 'user-2',
    })
  })

  it('does not flag equal role sets', async () => {
    const { ctx } = setup(roles(1, 2), roles(2, 1))

    await expect(
      compareDelegateRoles(null, { delegateUserId: 'user-2' }, ctx)
    ).resolves.toEqual({ hasFewerRoles: false })
  })

  it('does not flag a Delegate with broader roles', async () => {
    const { ctx } = setup(roles(1), roles(1, 2))

    await expect(
      compareDelegateRoles(null, { delegateUserId: 'user-2' }, ctx)
    ).resolves.toEqual({ hasFewerRoles: false })
  })

  it('does not flag a Delegate with fewer but different roles', async () => {
    const { ctx } = setup(roles(1, 2, 3), roles(4, 5))

    await expect(
      compareDelegateRoles(null, { delegateUserId: 'user-2' }, ctx)
    ).resolves.toEqual({ hasFewerRoles: false })
  })

  it('flags a Delegate with no roles when the buyer has some', async () => {
    const { ctx } = setup(roles(1), roles())

    await expect(
      compareDelegateRoles(null, { delegateUserId: 'user-2' }, ctx)
    ).resolves.toEqual({ hasFewerRoles: true })
  })

  it('says nothing when the roles of either side cannot be read', async () => {
    const failing = setup(roles(1, 2), new Error('forbidden'))
    const missing = setup({ Email: 'x' }, roles(1))

    await expect(
      compareDelegateRoles(null, { delegateUserId: 'user-2' }, failing.ctx)
    ).resolves.toEqual({ hasFewerRoles: false })
    await expect(
      compareDelegateRoles(null, { delegateUserId: 'user-2' }, missing.ctx)
    ).resolves.toEqual({ hasFewerRoles: false })
  })

  it.each([
    ['a missing delegate', ''],
    ['the buyer as delegate', 'buyer-1'],
  ])('rejects %s without reading any role', async (_, delegateUserId) => {
    const { ctx, licenseManager } = makeContext(buyer)

    await expect(
      compareDelegateRoles(null, { delegateUserId }, ctx)
    ).rejects.toMatchObject({ extensions: { status: 400 } })
    expect(licenseManager.getUserRoles).not.toHaveBeenCalled()
  })
})

describe('delegations granted to the buyer', () => {
  const asDelegate = () => ({
    grantee: [grantee()],
    granter: [granter({ delegationId: 'gr-1' })],
  })

  it('does not let the Delegate revoke a delegation granted to them', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce(asDelegate())

    await expect(
      revokeDelegation(null, { id: 'gr-1' }, ctx)
    ).rejects.toMatchObject({ extensions: { status: 403 } })
    expect(delegations.update).not.toHaveBeenCalled()
  })

  it('does not let the Delegate change the period of a delegation granted to them', async () => {
    const { ctx, delegations } = makeContext(buyer)
    delegations.list.mockResolvedValueOnce(asDelegate())

    await expect(
      updateDelegation(
        null,
        { id: 'gr-1', data: { endDate: '2026-12-10' } },
        ctx
      )
    ).rejects.toMatchObject({ extensions: { status: 403 } })
    expect(delegations.update).not.toHaveBeenCalled()
  })
})
