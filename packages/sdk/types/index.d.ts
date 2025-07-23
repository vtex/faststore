declare global {
  var faststore_sdk_stores: Map<string, Store>

  type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never
}

export {}
