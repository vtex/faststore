import { createCart } from "./index";
import { useMemo } from "react";

import { useStorage } from "../storage/useStorage";
import { Cart, Item } from ".";

const key = `faststore::cart`;

export const useCart = <I extends Item, C extends Cart<I>>(
  initialValue?: C,
) => {
  const [cart, setCart, store] = useStorage(key, initialValue);

  const actions = useMemo(() => createCart(store), [store]);

  return {
    ...cart,
    ...actions,
    setCart,
  };
};
