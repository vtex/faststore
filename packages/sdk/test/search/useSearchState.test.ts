import { initSearchState } from '../../src'

test('search state initialization does not append a `/` to the base path', async () => {
  let state = initSearchState({base: '/s'})

  expect(state.base).toBe('/s')
})
