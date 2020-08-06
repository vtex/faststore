export type Maybe<T> = T | undefined | null
export type ArrayItem<A> = A extends ReadonlyArray<infer T> ? T : never
