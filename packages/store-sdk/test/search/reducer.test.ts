import {
  removeSearchParam,
  initSearchParamsState,
  setSearchParam,
} from '../../src'

test('Search State Manager: change sort ordering', async () => {
  const state = initSearchParamsState()

  expect(state.sort).toBe('score-desc')

  setSearchParam(state, { key: 'sort', value: 'name-asc' })
  expect(state.sort).toBe('name-asc')

  expect(() => {
    setSearchParam(state, {
      key: 'sort',
      value: 'NotAValidSortValue',
    } as any)
  }).toThrow()
})

test('Search State Manager: Set personalized search', async () => {
  const state = initSearchParamsState()

  expect(state.personalized).toBe(false)

  setSearchParam(state, { key: 'personalized', value: true })
  expect(state.personalized).toBe(true)

  setSearchParam(state, { key: 'personalized', value: false })
  expect(state.personalized).toBe(false)
})

test('Search State Manager: Set full text term', async () => {
  const state = initSearchParamsState()
  const fullTextTerm = 'Full Text Term'

  expect(state.term).toBeNull()

  setSearchParam(state, { key: 'term', value: fullTextTerm })
  expect(state.term).toBe(fullTextTerm)

  setSearchParam(state, { key: 'term', value: null })
  expect(state.term).toBeNull()
})

test('Search State Manager: Select a facet', async () => {
  const state = initSearchParamsState()
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
    unique: false,
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
    unique: false,
  }

  expect(state.selectedFacets).toEqual([])

  setSearchParam(state, facet1)
  expect(state.selectedFacets).toEqual([facet1])

  setSearchParam(state, facet2)
  expect(state.selectedFacets).toEqual([facet1, facet2])

  setSearchParam(state, facet2)
  expect(state.selectedFacets).toEqual([facet1, facet2, facet2])
})

test('Search State Manager: Facet uniqueness', async () => {
  const state = initSearchParamsState()
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
    unique: true,
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
    unique: true,
  }

  expect(state.selectedFacets).toEqual([])

  setSearchParam(state, facet1)
  expect(state.selectedFacets).toEqual([facet1])

  setSearchParam(state, facet2)
  expect(state.selectedFacets).toEqual([facet1, facet2])

  setSearchParam(state, facet2)
  expect(state.selectedFacets).toEqual([facet1, facet2])

  setSearchParam(state, facet1)
  expect(state.selectedFacets).toEqual([facet1, facet2])
})

test('Search State Manager: Remove facet selection', async () => {
  const state = initSearchParamsState()
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
    unique: true,
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
    unique: false,
  }

  expect(state.selectedFacets).toEqual([])

  setSearchParam(state, facet1)
  setSearchParam(state, facet2)
  setSearchParam(state, facet2)
  expect(state.selectedFacets).toEqual([facet1, facet2, facet2])

  removeSearchParam(state, facet2)
  expect(state.selectedFacets).toEqual([facet1, facet2])
})

test('Search State Manager: Remove initial facet', async () => {
  const state = initSearchParamsState()
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
    unique: true,
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
    unique: false,
  }

  expect(state.selectedFacets).toEqual([])

  setSearchParam(state, facet1)
  setSearchParam(state, facet2)
  expect(state.selectedFacets).toEqual([facet1, facet2])

  /** Cannot remove the first facet */
  removeSearchParam(state, facet1)
  expect(state.selectedFacets).toEqual([facet1, facet2])
})
