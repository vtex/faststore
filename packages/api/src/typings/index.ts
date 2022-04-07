export type Platform = 'vtex'

export type PromiseType<T> = T extends Promise<infer U> ? U : T

export type ArrayElementType<T> = T extends Array<infer U> ? U : T
