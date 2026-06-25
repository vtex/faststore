import { describe, expect, it } from 'vitest'

import {
  isSwitchableContractSummary,
  isSwitchableSessionContract,
  mapSessionContractsToStoreContracts,
  parseSessionAvailableContracts,
  resolveActiveContractDisplayName,
  resolveContractDisplayNameFromMd,
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
        { id: 'a', corporateName: 'Corp A', isActive: false },
        { id: 'b', corporateName: 'Corp B', isActive: true },
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
        { id: 'a', corporateName: 'Corp A', isActive: false },
        { id: 'b', corporateName: 'Corp B', isActive: true },
      ])
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
