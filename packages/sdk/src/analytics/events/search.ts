// This isn't an ecommerce exclusive event, but it makes sense to include it in stores

export interface SearchData {
  search_term: string
}

export interface SearchEvent {
  name: 'search'
  params: SearchData
}
