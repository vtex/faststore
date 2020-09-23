declare type Maybe<T> = T | undefined | null
declare type ArrayItem<A> = A extends ReadonlyArray<infer T> ? T : never

// Missing types from graphql plugin
declare type Vtex_FilterType = 'BRAND' | 'CATEGORYTREE' | 'TEXT' | 'PRICERANGE'

declare type Vtex_SelectedFacetInput = {
  key: string
  value: string
}

declare type Vtex_SimulationBehavior = 'default' | 'skip'
