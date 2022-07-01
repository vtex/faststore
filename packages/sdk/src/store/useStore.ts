import { useSyncExternalStore } from "react";

import { Store } from "./base";

export const useStore = <T>(store: Store<T>) =>
  useSyncExternalStore(store.subscribe, store.read, store.readInitial);
