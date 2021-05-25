import {
  setSearchParam,
  formatSearchParamsState,
  parseSearchParamsState,
  initSearchParamsState,
} from '../../src'

test('Search State Serializer: Basic serialization', async () => {
  const state = initSearchParamsState()

  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/score-desc?map=sort'
  )

  setSearchParam(state, { key: 'term', value: 'Hello Wolrd' })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/score-desc?map=term%2Csort'
  )

  setSearchParam(state, { key: 'personalized', value: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/score-desc/per?map=term%2Csort%2Cpersonalized'
  )

  setSearchParam(state, { key: 'personalized', value: false })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/score-desc?map=term%2Csort'
  )

  setSearchParam(state, { key: 'priceRange', value: '10-to-100', unique: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/Hello%20Wolrd/10-to-100/score-desc?map=term%2CpriceRange%2Csort'
  )
})

test('Search State Serializer: serialization with base path', async () => {
  const state = initSearchParamsState({
    base: '/pt-br/sale',
  })

  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/score-desc?map=sort'
  )

  setSearchParam(state, { key: 'term', value: 'Hello Wolrd' })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/score-desc?map=term%2Csort'
  )

  setSearchParam(state, { key: 'personalized', value: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/score-desc/per?map=term%2Csort%2Cpersonalized'
  )

  setSearchParam(state, { key: 'personalized', value: false })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/score-desc?map=term%2Csort'
  )

  setSearchParam(state, { key: 'priceRange', value: '10-to-100', unique: true })
  expect(`${formatSearchParamsState(state)}`).toBe(
    'http://localhost/pt-br/sale/Hello%20Wolrd/10-to-100/score-desc?map=term%2CpriceRange%2Csort'
  )
})

test('Search State Serializer: Basic parsing', async () => {
  expect(
    parseSearchParamsState(
      new URL(
        'http://localhost/pt-br/sale/Hello%20Wolrd/10-to-100/score-desc?map=term%2CpriceRange%2Csort'
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
    sort: 'score-desc',
    term: 'Hello%20Wolrd',
  })

  expect(
    parseSearchParamsState(
      new URL(
        'http://localhost/pt-br/sale/Hello%20Wolrd/score-desc/per?map=term%2Csort%2Cpersonalized'
      )
    )
  ).toEqual({
    base: '/pt-br/sale/',
    personalized: true,
    selectedFacets: [],
    sort: 'score-desc',
    term: 'Hello%20Wolrd',
  })

  expect(
    parseSearchParamsState(
      new URL(
        'http://localhost/Hello%20Wolrd/score-desc/per?map=term%2Csort%2Cpersonalized'
      )
    )
  ).toEqual({
    base: '/',
    personalized: true,
    selectedFacets: [],
    sort: 'score-desc',
    term: 'Hello%20Wolrd',
  })
})
