import { Store } from "./base";

/**
 * Some stores, like cart/session states require to be singletons
 * for their correct behavior. This creator helps on this
 */
globalThis.faststore_sdk_stores = globalThis.faststore_sdk_stores ?? new Map();

export const singleton = <T>(
  key: string,
) =>
  (store: Store<T>) => {
    const stores = globalThis.faststore_sdk_stores;

    if (!stores.has(key)) {
      stores.set(key, store);
    }

    return stores.get(key) as Store<T>;
  };