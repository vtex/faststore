import { expect, test } from 'vitest'

import { removeFacet } from '../../src'

test('removeFacet: keep facets that share the value but not the key', () => {
  const material = { key: 'material', value: 'cotton' }
  const lining = { key: 'lining', value: 'cotton' }

  expect(removeFacet([material, lining], lining)).toEqual([material])
})
