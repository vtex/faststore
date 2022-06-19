import { useCallback } from "react";

import { useStore } from "../store/useStore";
import { getSingletonStore } from "./../store/global";
import { createStorageStore } from "./index";

import type { Store } from "../store";

export const useStorage = <T>(key: string, initialValue?: T) => {
  const store = getSingletonStore(key, () => createStorageStore(key, initialValue));
  const value = useStore(store);

  const setValue = useCallback((val: T) => store.set(val), [store]);

  return [value, setValue, store] as [T, (val: T) => void, Store<T>];
};
