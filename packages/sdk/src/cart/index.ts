import { optimisticStore } from "./../store/optimistic";
import { createStorageStore } from "./../storage/index";
import { SDKError } from "../utils/error";

export interface Item {
  id: string;
  quantity: number;
}

export interface Cart<I extends Item> {
  id: string;
  items: I[];
}

export const createCartStore = <C extends Cart<Item>>(
  defaultCart: C,
  onValidate?: (value: C) => Promise<C | null>,
) => {
  const store = optimisticStore(onValidate)(
    createStorageStore("faststore::cart", defaultCart),
  );

  const addItem = (
    item: Item,
  ) => {
    if (!item.id) {
      throw new SDKError("You must provide an `id` for items");
    }

    if (item.quantity < 0) {
      throw new SDKError("Item quantity needs to be higher than zero");
    }

    const c = store.read();
    const currentItem = getItem(item.id);

    const newItem = currentItem
      ? {
        ...item,
        quantity: currentItem.quantity + item.quantity,
      }
      : item;

    store.set({
      ...c,
      items: currentItem
        ? c.items.map((item) => item === currentItem ? newItem : item)
        : [...c.items, newItem],
    });
  };

  const updateItemQuantity = (
    id: string,
    quantity: number,
  ) => {
    const c = store.read();
    const currentItem = getItem(id);

    if (!currentItem) {
      throw new SDKError(`Item with id not found: ${id}`);
    }

    const newItem = {
      ...currentItem,
      quantity,
    };

    store.set({
      ...c,
      items: c.items.map((item) => item === currentItem ? newItem : item),
    });
  };

  const removeItem = (
    id: string,
  ) => {
    const c = store.read();
    const removed = getItem(id);

    store.set({
      ...c,
      items: c.items.filter((item) => item !== removed),
    });
  };

  const emptyCart = () => store.set({ ...store.read(), items: [] });

  const getItem = (
    id: string,
  ) => store.read().items.find((item) => item.id === id);

  const inCart = (
    id: string,
  ) => Boolean(getItem(id));

  const isEmpty = () => store.read().items.length === 0;

  return {
    ...store,
    addItem,
    updateItemQuantity,
    removeItem,
    emptyCart,
    inCart,
    isEmpty,
  };
};
