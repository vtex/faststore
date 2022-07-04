import { waitFor } from "../waitFor";
import { set } from "idb-keyval";

import { createBaseStore, persisted } from "../../src";

const getStore = <T>(initial: T, key: string) =>
  persisted<T>(key)(createBaseStore(initial));

const key = "k";
const storedValue = { a: 1 };
const initialValue = { a: 2 };

test("Persisted Store: Hydrate with initial value", () => {
  const store = getStore(initialValue, key);

  expect(store.read()).toEqual(initialValue);
});

test("Persisted Store: Read value from localStorage after hydration", async () => {
  set(key, storedValue);

  const store = getStore(initialValue, key);

  await waitFor(() => expect(store.read()).toEqual(storedValue));
});
