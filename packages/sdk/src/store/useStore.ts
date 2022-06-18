import { useEffect, useState } from "react";
import { Store } from ".";

export const useStore = <T>(store: Store<T>) => {
  const [state, setState] = useState(() => store.read());

  useEffect(() => store.subscribe(setState), [store]);

  return state;
};
