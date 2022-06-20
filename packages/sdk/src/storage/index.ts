/**
 * Safe IDB storage interface. These try..catch are useful because
 * some browsers may block access to these APIs due to security policies
 *
 * Also, the stored value is lazy-loaded to avoid hydration mismatch
 * between server/browser. When state is 'hydrated', the value in the heap
 * is the same as the value in IDB
 */
import { get, set } from "idb-keyval";
import { createSingletonStore } from "../store/singleton";

export const createStorageStore = <T>(key: string, initialValue?: T) => {
  const store = createSingletonStore<T>(key, initialValue);

  const handler = async () => {
    try {
      const payload = await get<T>(key);

      payload !== undefined && store.set(payload);
    } catch (err) {
      // noop
    }
  };

  handler();
  globalThis.addEventListener?.("focus", handler);
  globalThis.document?.addEventListener(
    "visibilitychange",
    () => document.visibilityState === "visible" && handler(),
  );

  store.subscribe((value) => {
    set(key, value).catch();
  });

  return store;
};
