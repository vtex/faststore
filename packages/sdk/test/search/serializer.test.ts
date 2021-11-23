import { formatSearchState, parseSearchState, initSearchState } from '../../src'

test('Search State Serializer: Basic serialization', async () => {
  let state = initSearchState()

  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/score_desc/0?map=sort%2Cpage'
  )

  state = {
    ...state,
    term: 'Hello Wolrd',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/score_desc/0?map=term%2Csort%2Cpage'
  )

  state = {
    ...state,
    selectedFacets: [
      ...state.selectedFacets,
      { key: 'priceRange', value: '10-to-100' },
    ],
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/10-to-100/score_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
  )

  state = {
    ...state,
    sort: 'price_desc',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/10-to-100/price_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
  )
})

test('Search State Serializer: serialization with base path', async () => {
  let state = initSearchState({
    base: '/pt-br/sale',
  })

  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/score_desc/0?map=sort%2Cpage'
  )

  state = {
    ...state,
    term: 'Hello Wolrd',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/score_desc/0?map=term%2Csort%2Cpage'
  )

  state = {
    ...state,
    selectedFacets: [
      ...state.selectedFacets,
      { key: 'priceRange', value: '10-to-100' },
    ],
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/10-to-100/score_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
  )

  state = {
    ...state,
    sort: 'price_desc',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/10-to-100/price_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
  )
})

test('Search State Serializer: Basic parsing', async () => {
  expect(
    parseSearchState(
      new URL(
        'http://localhost/pt-br/sale/Hello%20Wolrd/10-to-100/score_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
      )
    )
  ).toEqual({
    base: '/pt-br/sale/',
    selectedFacets: [
      {
        key: 'priceRange',
        value: '10-to-100',
      },
    ],
    sort: 'score_desc',
    term: 'Hello%20Wolrd',
    page: 0,
  })

  expect(
    parseSearchState(
      new URL(
        'http://localhost/pt-br/sale/Hello%20Wolrd/score_desc/1?map=term%2Csort%2Cpage'
      )
    )
  ).toEqual({
    base: '/pt-br/sale/',
    selectedFacets: [],
    sort: 'score_desc',
    term: 'Hello%20Wolrd',
    page: 1,
  })

  expect(
    parseSearchState(
      new URL(
        'http://localhost/Hello%20Wolrd/score_desc/10?map=term%2Csort%2Cpage'
      )
    )
  ).toEqual({
    base: '/',
    selectedFacets: [],
    sort: 'score_desc',
    term: 'Hello%20Wolrd',
    page: 10,
  })
})
