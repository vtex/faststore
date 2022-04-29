export const TopSearchesQuery = `query TopSearchesQuery {
  topSearches {
    term
    occurrences
  }
}
`

export const topSearchesFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/top_searches',
  init: undefined,
  result: JSON.parse(
    '{"searches":[{"term":"what really happened with aaron swartz","count":7246},{"term":"whaaaat","count":6225},{"term":"salad","count":4263},{"term":"sleek woden","count":4068},{"term":"new search","count":3789}]}'
  ),
}
