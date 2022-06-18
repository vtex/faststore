import { useCallback } from "react";

import { useStore } from "../store/useStore";
import { createStorageStore } from "./index";

import type { Store } from "../store";

const storeMap = new Map();

const getOrCreate = <T>(key: string, initialValue?: T) => {
  if (!storeMap.has(key)) {
    storeMap.set(key, createStorageStore(key, initialValue));
  }

  return storeMap.get(key) as Store<T>;
};

export const useStorage = <T>(key: string, initialValue?: T) => {
  const store = getOrCreate(key, initialValue);
  const value = useStore(store);

  const setValue = useCallback((val: T) => {
    store.set(val);
  }, [store]);

  return [value, setValue] as [T, (val: T) => void];
};
