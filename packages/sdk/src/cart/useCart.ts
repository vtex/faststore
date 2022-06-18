import { useMemo } from "react";

import { useStore } from "../store/useStore";
import { SDKError } from "../utils/error";
import { Cart, CartStore, Item } from "./store";

export const useCart = <I extends Item, C extends Cart<I>>(
  store: CartStore<I, C>,
) => {
  const storedCart = useStore(store);

  const actions = useMemo(() => {
    const setCart = (cart: C) => store.set(cart);

    const addItem = (item: I) => {
      if (!item.id) {
        throw new SDKError("You must provide an `id` for items");
      }

      if (item.quantity < 0) {
        throw new SDKError("Item quantity needs to be higher than zero");
      }

      const cart = store.read();
      const currentItem = getItem(item.id);

      const newItem = currentItem
        ? {
          ...item,
          quantity: currentItem.quantity + item.quantity,
        }
        : item;

      store.set({
        ...cart,
        items: currentItem
          ? cart.items.map((item) => item === currentItem ? newItem : item)
          : [...cart.items, newItem],
      });
    };

    const updateItemQuantity = (id: string, quantity: number) => {
      const cart = store.read();
      const currentItem = getItem(id);

      if (!currentItem) {
        throw new SDKError(`Item with id not found: ${id}`);
      }

      const newItem = {
        ...currentItem,
        quantity,
      };

      store.set({
        ...cart,
        items: cart.items.map((item) => item === currentItem ? newItem : item),
      });
    };

    const removeItem = (id: string) => {
      const cart = store.read();
      const removed = getItem(id);

      store.set({
        ...cart,
        items: cart.items.filter((item) => item !== removed),
      });
    };

    const emptyCart = () => store.set({ ...store.read(), items: [] });

    const getItem = (id: string) =>
      store.read().items.find((item) => item.id === id);

    const inCart = (id: string) => Boolean(getItem(id));

    const isEmpty = () => store.read().items.length === 0;

    return {
      setCart,
      emptyCart,
      isEmpty,
      inCart,

      addItem,
      updateItemQuantity,
      removeItem,
      getItem,
    };
  }, [store]);

  return {
    ...storedCart,
    ...actions,
  };
};
