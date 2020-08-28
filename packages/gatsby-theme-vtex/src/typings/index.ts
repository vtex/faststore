declare type Maybe<T> = T | null
declare type ArrayItem<A> = A extends ReadonlyArray<infer T> ? T : never

// Missing types from graphql plugin
declare type Vtex_FilterType = 'BRAND' | 'CATEGORYTREE' | 'TEXT' | 'PRICERANGE'
