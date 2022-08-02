import { SDKError } from "../utils/error";
import { createStore } from "./../store/composed";

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
  namespace = "fs::cart",
) => {
  const store = createStore(defaultCart, namespace, onValidate);

  const addItem = (
    item: Item,
  ) => {
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

  const updateItemQuantity = (
    id: string,
    quantity: number,
  ) => {
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
      items: cart.items
        .map((item) => item === currentItem ? newItem : item) // update item quantity
        .filter((item) => item.quantity > 0), // remove items if quantity is <= 0
    });
  };

  const removeItem = (
    id: string,
  ) => {
    const cart = store.read();
    const removed = getItem(id);

    store.set({
      ...cart,
      items: cart.items.filter((item) => item !== removed),
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
    getItem,
    addItem,
    updateItemQuantity,
    removeItem,
    emptyCart,
    inCart,
    isEmpty,
  };
};
