import { expect, test } from 'vitest'
import { initSearchState } from '../../src'

test('search state initialization does not append a `/` to the base path', async () => {
  const state = initSearchState({ base: '/s' })

  expect(state.base).toBe('/s')
})
