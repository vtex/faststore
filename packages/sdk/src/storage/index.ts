/**
 * Safe IDB storage interface. These try..catch are useful because
 * some browsers may block access to these APIs due to security policies
 *
 * Also, the stored value is lazy-loaded to avoid hydration mismatch
 * between server/browser. When state is 'hydrated', the value in the heap
 * is the same as the value in IDB
 */
import { get, set } from "idb-keyval";
import { createStore } from "../store";

const getItem = async <T>(key: string) => {
  try {
    const value = await get<T>(key);

    return value ?? null;
  } catch (err) {
    return null;
  }
};

const setItem = async <T>(key: string, value: T | null) => {
  try {
    await set(key, value);
  } catch (err) {
    // noop
  }
};

export const createStorageStore = <T>(
  key: string,
  initialValue?: T,
) => {
  const store = createStore<T>((setter) => {
    const handler = async () => {
      const payload = await getItem<T>(key);

      if (payload !== null) {
        setter(payload);
      }
    };

    handler();

    globalThis.addEventListener?.("focus", handler);
    globalThis.document?.addEventListener("visibilitychange", handler);
  }, initialValue);

  store.subscribe((val) => setItem(key, val));

  return store;
};
