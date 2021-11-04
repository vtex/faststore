import {
  setSearchParam,
  formatSearchParamsState,
  parseSearchParamsState,
  initSearchParamsState,
} from '../../src'

test('Search State Serializer: Basic serialization', async () => {
  const state = initSearchParamsState()

  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/score_desc/0?map=sort%2Cpage'
  )

  setSearchParam(state, { key: 'term', value: 'Hello Wolrd' })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/score_desc/0?map=term%2Csort%2Cpage'
  )

  setSearchParam(state, { key: 'personalized', value: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/score_desc/per/0?map=term%2Csort%2Cpersonalized%2Cpage'
  )

  setSearchParam(state, { key: 'personalized', value: false })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/score_desc/0?map=term%2Csort%2Cpage'
  )

  setSearchParam(state, { key: 'priceRange', value: '10-to-100', unique: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/10-to-100/score_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
  )
})

test('Search State Serializer: serialization with base path', async () => {
  const state = initSearchParamsState({
    base: '/pt-br/sale',
  })

  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/score_desc/0?map=sort%2Cpage'
  )

  setSearchParam(state, { key: 'term', value: 'Hello Wolrd' })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/score_desc/0?map=term%2Csort%2Cpage'
  )

  setSearchParam(state, { key: 'personalized', value: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/score_desc/per/0?map=term%2Csort%2Cpersonalized%2Cpage'
  )

  setSearchParam(state, { key: 'personalized', value: false })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/score_desc/0?map=term%2Csort%2Cpage'
  )

  setSearchParam(state, { key: 'priceRange', value: '10-to-100', unique: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/10-to-100/score_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
  )
})

test('Search State Serializer: Basic parsing', async () => {
  expect(
    parseSearchParamsState(
      new URL(
        'http://localhost/pt-br/sale/Hello%20Wolrd/10-to-100/score_desc/0?map=term%2CpriceRange%2Csort%2Cpage'
      )
    )
  ).toEqual({
    base: '/pt-br/sale/',
    personalized: false,
    selectedFacets: [
      {
        key: 'priceRange',
        unique: false,
        value: '10-to-100',
      },
    ],
    sort: 'score_desc',
    term: 'Hello%20Wolrd',
    page: 0,
  })

  expect(
    parseSearchParamsState(
      new URL(
        'http://localhost/pt-br/sale/Hello%20Wolrd/score_desc/per/1?map=term%2Csort%2Cpersonalized%2Cpage'
      )
    )
  ).toEqual({
    base: '/pt-br/sale/',
    personalized: true,
    selectedFacets: [],
    sort: 'score_desc',
    term: 'Hello%20Wolrd',
    page: 1,
  })

  expect(
    parseSearchParamsState(
      new URL(
        'http://localhost/Hello%20Wolrd/score_desc/per/10?map=term%2Csort%2Cpersonalized%2Cpage'
      )
    )
  ).toEqual({
    base: '/',
    personalized: true,
    selectedFacets: [],
    sort: 'score_desc',
    term: 'Hello%20Wolrd',
    page: 10,
  })
})
