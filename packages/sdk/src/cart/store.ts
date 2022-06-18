import { Store } from "../store";
import { createStorageStore } from "./../storage/useStorage";

export interface Item {
  id: string;
  quantity: number;
}

export interface Cart<I extends Item> {
  id: string;
  items: I[];
}

export type CartStore<I extends Item, C extends Cart<I>> = Store<C>;

export const createCartStore = <I extends Item, C extends Cart<I>>({
  namespace = "main",
  initialCart,
}: {
  namespace?: string;
  initialCart?: C;
}) => createStorageStore(`${namespace}::store::cart`, initialCart);
