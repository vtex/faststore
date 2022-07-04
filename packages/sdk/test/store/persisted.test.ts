import { renderHook } from "@testing-library/react-hooks/native";
import { set } from "idb-keyval";

import { createBaseStore, persisted, useStore } from "../../src";

const getStore = <T>(initial: T, key: string) =>
  persisted<T>(key)(createBaseStore(initial));

const key = "k";
const storedValue = { a: 1 };
const initialValue = { a: 2 };

test("Persisted Store: Hydrate with initial value", () => {
  const hook = renderHook(useStore, {
    initialProps: getStore(initialValue, key),
  });

  expect(hook.result.current).toEqual(initialValue);
});

test("Persisted Store: Read value from localStorage after hydration", async () => {
  set(key, storedValue);

  const hook = renderHook(useStore, {
    initialProps: getStore(initialValue, key),
  });

  await hook.waitFor(() => expect(hook.result.current).toEqual(storedValue));
});
