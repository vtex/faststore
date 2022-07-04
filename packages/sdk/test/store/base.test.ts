import { renderHook } from "@testing-library/react-hooks/native";

import { createBaseStore, useStore } from "../../src";

test("Store: Returns initial value", () => {
  const store = createBaseStore({ a: 1 });

  const { result } = renderHook(useStore, { initialProps: store });

  expect(result.current.a).toBe(1);
});

test("Store: Broadcasts after set", async () => {
  const store = createBaseStore({ a: 1 });
  const mocked = jest.fn();

  store.subscribe(mocked);
  store.set({ a: 2 });

  const { result } = renderHook(useStore, { initialProps: store });

  expect(mocked).toBeCalledTimes(1);
  expect(result.current.a).toBe(2);
});

test("Store: Returns initial value after set", async () => {
  const store = createBaseStore({ a: 1 });
  const mocked = jest.fn();

  store.subscribe(mocked);
  store.set({ a: 2 });

  expect(mocked).toBeCalledTimes(1);
  expect(store.read()).toBe(2);
  expect(store.readInitial().a).toBe(1);
});
