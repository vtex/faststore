import { describe, expect, it } from 'vitest'

import type { AttachedContract } from '../../../../../src/platforms/vtex/clients/commerce/types/StoreFrontContracts'
import {
  isSwitchableContractSummary,
  isSwitchableSessionContract,
  mapSessionContractsToStoreContracts,
  parseSessionAvailableContracts,
  resolveActiveContractDisplayName,
  resolveActiveContractIdFromSession,
  resolveContractDisplayNameFromMd,
  resolveDefaultContractId,
} from '../../../../../src/platforms/vtex/utils/contract'

describe('contract utils', () => {
  describe('resolveContractDisplayNameFromMd', () => {
    it('prefers corporateName over firstName', () => {
      expect(
        resolveContractDisplayNameFromMd({
          corporateName: 'Corp',
          firstName: 'Jane',
        })
      ).toBe('Corp')
    })

    it('falls back to firstName when corporateName is empty', () => {
      expect(
        resolveContractDisplayNameFromMd({
          corporateName: '',
          firstName: 'Jane',
        })
      ).toBe('Jane')
    })
  })

  describe('parseSessionAvailableContracts', () => {
    it('returns typed contracts from shopper.availableContracts', () => {
      expect(
        parseSessionAvailableContracts({
          availableContracts: {
            value: [
              {
                customerId: 'c1',
                contractName: 'SUMA B2B Contract',
                isActive: true,
                isCurrent: true,
              },
            ],
          },
        })
      ).toEqual([
        {
          customerId: 'c1',
          contractName: 'SUMA B2B Contract',
          isActive: true,
          isCurrent: true,
        },
      ])
    })

    it('returns an empty list when availableContracts is missing', () => {
      expect(parseSessionAvailableContracts(null)).toEqual([])
    })

    it('filters malformed session contract entries', () => {
      expect(
        parseSessionAvailableContracts({
          availableContracts: {
            value: [
              {
                customerId: 'c1',
                contractName: 'Valid',
                isActive: true,
                isCurrent: false,
              },
              {
                customerId: '',
                contractName: 'Invalid',
                isActive: true,
                isCurrent: false,
              },
              null,
            ],
          },
        })
      ).toEqual([
        {
          customerId: 'c1',
          contractName: 'Valid',
          isActive: true,
          isCurrent: false,
        },
      ])
    })
  })

  describe('isSwitchableSessionContract', () => {
    it('requires id, name, and active status', () => {
      expect(
        isSwitchableSessionContract({
          customerId: 'c1',
          contractName: 'Corp',
          isActive: true,
          isCurrent: false,
        })
      ).toBe(true)

      expect(
        isSwitchableSessionContract({
          customerId: 'c1',
          contractName: '',
          isActive: true,
          isCurrent: false,
        })
      ).toBe(false)

      expect(
        isSwitchableSessionContract({
          customerId: 'c1',
          contractName: 'Corp',
          isActive: false,
          isCurrent: false,
        })
      ).toBe(false)
    })
  })

  describe('mapSessionContractsToStoreContracts', () => {
    it('maps session contracts to GraphQL StoreContract entries', () => {
      expect(
        mapSessionContractsToStoreContracts([
          {
            customerId: 'a',
            contractName: 'Corp A',
            isActive: true,
            isCurrent: false,
          },
          {
            customerId: 'b',
            contractName: 'Corp B',
            isActive: true,
            isCurrent: true,
          },
        ])
      ).toEqual([
        { id: 'a', corporateName: 'Corp A', isActive: false, isDefault: false },
        { id: 'b', corporateName: 'Corp B', isActive: true, isDefault: false },
      ])
    })

    it('uses activeContractId when isCurrent flags are stale', () => {
      expect(
        mapSessionContractsToStoreContracts(
          [
            {
              customerId: 'a',
              contractName: 'Corp A',
              isActive: true,
              isCurrent: true,
            },
            {
              customerId: 'b',
              contractName: 'Corp B',
              isActive: true,
              isCurrent: false,
            },
          ],
          'b'
        )
      ).toEqual([
        { id: 'a', corporateName: 'Corp A', isActive: false, isDefault: false },
        { id: 'b', corporateName: 'Corp B', isActive: true, isDefault: false },
      ])
    })

    it('falls back to isCurrent when activeContractId is empty', () => {
      expect(
        mapSessionContractsToStoreContracts([
          {
            customerId: 'a',
            contractName: 'Corp A',
            isActive: true,
            isCurrent: false,
          },
          {
            customerId: 'b',
            contractName: 'Corp B',
            isActive: true,
            isCurrent: true,
          },
        ])
      ).toEqual([
        { id: 'a', corporateName: 'Corp A', isActive: false, isDefault: false },
        { id: 'b', corporateName: 'Corp B', isActive: true, isDefault: false },
      ])
    })
  })

  describe('resolveActiveContractIdFromSession', () => {
    it('prefers shopper.activeContractId over authentication and profile ids', () => {
      expect(
        resolveActiveContractIdFromSession({
          namespaces: {
            shopper: { activeContractId: { value: 'shopper-id' } },
            authentication: { customerId: { value: 'auth-id' } },
            profile: { id: { value: 'profile-id' } },
          },
        })
      ).toBe('shopper-id')
    })

    it('falls back to authentication.customerId and profile.id', () => {
      expect(
        resolveActiveContractIdFromSession({
          namespaces: {
            authentication: { customerId: { value: 'auth-id' } },
            profile: { id: { value: 'profile-id' } },
          },
        })
      ).toBe('auth-id')

      expect(
        resolveActiveContractIdFromSession({
          namespaces: {
            profile: { id: { value: 'profile-id' } },
          },
        })
      ).toBe('profile-id')
    })
  })

  describe('isSwitchableContractSummary', () => {
    it('requires display name and email', () => {
      expect(
        isSwitchableContractSummary({
          corporateName: 'Corp',
          email: 'a@example.com',
        })
      ).toBe(true)

      expect(
        isSwitchableContractSummary({
          corporateName: '',
          firstName: '',
          email: 'a@example.com',
        })
      ).toBe(false)
    })
  })

  describe('resolveActiveContractDisplayName', () => {
    it('falls back to session profile names when Master Data has no name', () => {
      expect(
        resolveActiveContractDisplayName(
          { corporateName: '' },
          {
            firstName: { value: 'Jane' },
            lastName: { value: 'Doe' },
          }
        )
      ).toBe('Jane')
    })
  })
})

describe('resolveDefaultContractId', () => {
  it('prefers an explicit isDefault flag', () => {
    expect(
      resolveDefaultContractId([{ id: 'a' }, { id: 'b', isDefault: true }])
    ).toBe('b')
  })

  it('falls back to the first attached contract (BFF returns the default first)', () => {
    expect(resolveDefaultContractId([{ id: ' a ' }, { id: 'b' }])).toBe('a')
  })

  it('returns an empty id when the list is missing or empty', () => {
    expect(resolveDefaultContractId(undefined)).toBe('')
    expect(resolveDefaultContractId([])).toBe('')
  })

  it('returns an empty id when a malformed 200 sends a non-array value', () => {
    expect(
      resolveDefaultContractId('not-an-array' as unknown as AttachedContract[])
    ).toBe('')
    expect(resolveDefaultContractId({} as unknown as AttachedContract[])).toBe(
      ''
    )
  })

  it('coerces a non-string id to a string', () => {
    expect(resolveDefaultContractId([{ id: 123 as unknown as string }])).toBe(
      '123'
    )
  })
})

describe('mapSessionContractsToStoreContracts isDefault', () => {
  const contracts = [
    { customerId: 'a', contractName: 'A', isActive: true, isCurrent: true },
    { customerId: 'b', contractName: 'B', isActive: true, isCurrent: false },
  ]

  it('marks the default contract', () => {
    expect(mapSessionContractsToStoreContracts(contracts, 'a', 'b')).toEqual([
      { id: 'a', corporateName: 'A', isActive: true, isDefault: false },
      { id: 'b', corporateName: 'B', isActive: false, isDefault: true },
    ])
  })

  it('marks nobody when no default is known', () => {
    expect(
      mapSessionContractsToStoreContracts(contracts, 'a').every(
        (c) => c.isDefault === false
      )
    ).toBe(true)
  })
})
