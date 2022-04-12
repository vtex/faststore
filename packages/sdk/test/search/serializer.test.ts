import { formatSearchState, parseSearchState, initSearchState } from '../../src'

test('Search State Serializer: Basic serialization', async () => {
  let state = initSearchState()

  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/?sort=score_desc&page=0'
  )

  state = {
    ...state,
    term: 'Hello World',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/?q=Hello+World&sort=score_desc&page=0'
  )

  state = {
    ...state,
    selectedFacets: [
      ...state.selectedFacets,
      { key: 'price', value: '10:100' },
    ],
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/?q=Hello+World&price=10%3A100&facets=price&sort=score_desc&page=0'
  )

  state = {
    ...state,
    sort: 'price_desc',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/?q=Hello+World&price=10%3A100&facets=price&sort=price_desc&page=0'
  )
})

test('Search State Serializer: serialization with base path', async () => {
  let state = initSearchState({
    base: '/pt-br/sale',
  })

  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/?sort=score_desc&page=0'
  )

  state = {
    ...state,
    term: 'Hello World',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/?q=Hello+World&sort=score_desc&page=0'
  )

  state = {
    ...state,
    selectedFacets: [
      ...state.selectedFacets,
      { key: 'price', value: '10:100' },
    ],
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/?q=Hello+World&price=10%3A100&facets=price&sort=score_desc&page=0'
  )

  state = {
    ...state,
    sort: 'price_desc',
  }
  expect(`${formatSearchState(state)}`).toBe(
    'http://localhost/pt-br/sale/?q=Hello+World&price=10%3A100&facets=price&sort=price_desc&page=0'
  )
})

test('Search State Serializer: Basic parsing', async () => {
  expect(
    parseSearchState(
      new URL(
        'http://localhost/pt-br/sale/?q=Hello+World&&sort=score_desc&price=10%3A100&page=0&facets=price'
      )
    )
  ).toEqual({
    base: '/pt-br/sale/',
    selectedFacets: [
      {
        key: 'price',
        value: '10:100',
      },
    ],
    sort: 'score_desc',
    term: 'Hello World',
    page: 0,
  })

  expect(
    parseSearchState(
      new URL(
        'http://localhost/pt-br/sale/?q=Hello+World&sort=score_desc&page=1'
      )
    )
  ).toEqual({
    base: '/pt-br/sale/',
    selectedFacets: [],
    sort: 'score_desc',
    term: 'Hello World',
    page: 1,
  })

  expect(
    parseSearchState(
      new URL('http://localhost/?q=Hello+World&sort=score_desc&page=10')
    )
  ).toEqual({
    base: '/',
    selectedFacets: [],
    sort: 'score_desc',
    term: 'Hello World',
    page: 10,
  })
})
