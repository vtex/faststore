export type ArrayItem<A> = A extends ReadonlyArray<infer T> ? T : never
