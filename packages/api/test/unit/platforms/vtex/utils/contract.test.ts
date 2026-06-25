import { describe, expect, it } from 'vitest'

import {
  isSwitchableContractSummary,
  isSwitchableStoreFrontContract,
  resolveActiveContractDisplayName,
  resolveContractDisplayNameFromMd,
  resolveContractDisplayNameFromStoreFront,
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

  describe('resolveContractDisplayNameFromStoreFront', () => {
    it('returns trimmed contract name', () => {
      expect(
        resolveContractDisplayNameFromStoreFront({
          id: 'c1',
          name: ' SUMA B2B Contract ',
        })
      ).toBe('SUMA B2B Contract')
    })
  })

  describe('isSwitchableStoreFrontContract', () => {
    it('requires id, name, and email', () => {
      expect(
        isSwitchableStoreFrontContract({
          id: 'c1',
          name: 'Corp',
          email: 'a@example.com',
        })
      ).toBe(true)

      expect(
        isSwitchableStoreFrontContract({
          id: 'c1',
          name: '',
          email: 'a@example.com',
        })
      ).toBe(false)
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
      ).toBe('Jane Doe')
    })
  })
})
