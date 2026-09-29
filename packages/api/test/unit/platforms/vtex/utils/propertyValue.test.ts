import { describe, expect, it } from 'vitest'
import type { OrderFormBundleItem } from '../../../../../src/platforms/vtex/clients/commerce/types/OrderForm'
import { md5 } from '../../../../../src/platforms/vtex/utils/md5'
import {
  getServiceKey,
  serviceToPropertyValue,
  VALUE_REFERENCES,
} from '../../../../../src/platforms/vtex/utils/propertyValue'

const installation = (
  overrides: Partial<OrderFormBundleItem> = {}
): OrderFormBundleItem => ({
  id: '10',
  name: 'Sample service',
  quantity: 1,
  sellingPrice: 2500,
  attachments: [],
  ...overrides,
})

describe('serviceToPropertyValue', () => {
  it('maps a bundle item to a SERVICE property with a stable key', () => {
    expect(serviceToPropertyValue(installation())).toEqual({
      propertyID: md5('SERVICE:10:[]'),
      name: 'Sample service',
      value: { id: '10', price: 25, attachments: [] },
      valueReference: VALUE_REFERENCES.service,
    })
  })

  it('treats missing attachments as none', () => {
    const withNull = serviceToPropertyValue(installation({ attachments: null }))
    const withUndefined = serviceToPropertyValue(
      installation({ attachments: undefined })
    )

    expect(withNull.propertyID).toBe(md5('SERVICE:10:[]'))
    expect(withUndefined.propertyID).toBe(withNull.propertyID)
    expect(withNull.value.attachments).toEqual([])
  })

  it('derives the key from id and attachments only, never from name or price', () => {
    const base = serviceToPropertyValue(installation())
    const renamed = serviceToPropertyValue(
      installation({ name: 'Installation', sellingPrice: 1 })
    )
    const otherId = serviceToPropertyValue(installation({ id: '4' }))
    const withMessage = serviceToPropertyValue(
      installation({
        attachments: [{ name: 'message', content: { text: 'hi' } }],
      })
    )

    expect(renamed.propertyID).toBe(base.propertyID)
    expect(otherId.propertyID).not.toBe(base.propertyID)
    expect(withMessage.propertyID).not.toBe(base.propertyID)
  })

  it('sorts attachments by name so the key is order independent', () => {
    const a = { name: 'a', content: { v: '1' } }
    const b = { name: 'b', content: { v: '2' } }

    expect(
      serviceToPropertyValue(installation({ attachments: [a, b] })).propertyID
    ).toBe(
      serviceToPropertyValue(installation({ attachments: [b, a] })).propertyID
    )
  })
})

describe('getServiceKey', () => {
  const property = serviceToPropertyValue(installation())

  it('matches the orderForm key when the value is an object', () => {
    expect(getServiceKey(property)).toBe(property.propertyID)
  })

  it('matches the orderForm key when the value is a JSON string', () => {
    expect(
      getServiceKey({ ...property, value: JSON.stringify(property.value) })
    ).toBe(property.propertyID)
  })

  it('ignores propertyID, name and price on the way in', () => {
    expect(
      getServiceKey({
        ...property,
        propertyID: 'tampered',
        name: 'Other',
        value: { ...property.value, price: 0 },
      })
    ).toBe(property.propertyID)
  })

  it('accepts a numeric id', () => {
    expect(getServiceKey({ ...property, value: { id: 10 } })).toBe(
      property.propertyID
    )
  })

  it('yields a key matching no service when the value is unreadable', () => {
    const unreadable = [
      'not-json',
      '"a string"',
      '{}',
      { attachments: [] },
      null,
      42,
    ]

    for (const value of unreadable) {
      const key = getServiceKey({ ...property, value })
      expect(key).not.toBe(property.propertyID)
      expect(key).not.toMatch(/^[0-9a-f]{32}$/)
    }
  })

  it('ignores malformed attachment entries', () => {
    expect(
      getServiceKey({
        ...property,
        value: { id: '10', attachments: [null, 'x', { content: {} }] },
      })
    ).toBe(property.propertyID)
  })

  it('sorts attachment content fields so field order does not change the key', () => {
    const textFirst = serviceToPropertyValue(
      installation({
        attachments: [{ name: 'message', content: { text: 'hi', from: 'a' } }],
      })
    )
    const fromFirst = serviceToPropertyValue(
      installation({
        attachments: [{ name: 'message', content: { from: 'a', text: 'hi' } }],
      })
    )

    expect(fromFirst.propertyID).toBe(textFirst.propertyID)
    expect(
      getServiceKey({
        ...textFirst,
        value: {
          id: '10',
          attachments: [
            { name: 'message', content: { from: 'a', text: 'hi' } },
          ],
        },
      })
    ).toBe(textFirst.propertyID)
  })

  it('keeps an own __proto__ content field in the key', () => {
    const plain = serviceToPropertyValue(
      installation({
        attachments: [{ name: 'message', content: { text: 'hi' } }],
      })
    )
    const withProtoField = serviceToPropertyValue(
      installation({
        attachments: [
          {
            name: 'message',
            content: JSON.parse('{"text":"hi","__proto__":"x"}'),
          },
        ],
      })
    )

    expect(withProtoField.propertyID).not.toBe(plain.propertyID)
  })

  it('ignores an attachment whose content is not an object', () => {
    const malformed = [
      { name: 'message' },
      { name: 'note', content: 'text' },
      { name: 'tags', content: ['a'] },
    ]

    expect(
      serviceToPropertyValue(
        installation({
          attachments: malformed as OrderFormBundleItem['attachments'],
        })
      ).propertyID
    ).toBe(property.propertyID)
    expect(
      getServiceKey({
        ...property,
        value: { id: '10', attachments: malformed },
      })
    ).toBe(property.propertyID)
  })
})
