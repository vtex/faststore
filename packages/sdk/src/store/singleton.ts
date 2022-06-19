/**
 * Some stores, like cart/session states require to be singletons
 * for their correct behavior. This creator helps on this
 */
import { Store } from ".";

globalThis.faststore_sdk_stores = globalThis.faststore_sdk_stores ?? new Map();

export const getSingletonStore = <T>(key: string, storeCreator: () => Store<T>) => {
  const stores = globalThis.faststore_sdk_stores;

  if (!stores.has(key)) {
    stores.set(key, storeCreator());
  }

  return stores.get(key) as Store<T>;
};
