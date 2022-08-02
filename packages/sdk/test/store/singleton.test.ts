import { createBaseStore, singleton } from "../../src";

const getStore = <T>(initial: T, key = "key") =>
  singleton<T>(key)(createBaseStore(initial));

test("Singleton Store: creates once", () => {
  const store1 = getStore({ a: 1 });
  const store2 = getStore({ a: 2 });

  expect(store1).toBe(store2);
  expect(store1.read()).toEqual({ a: 1 });
  expect(store2.read()).toEqual({ a: 1 });
});

test("Singleton Store: creates twice if different keys", () => {
  const store1 = getStore({ a: 1 }, "key1");
  const store2 = getStore({ a: 2 }, "key2");

  expect(store1).not.toBe(store2);
  expect(store1.read()).toEqual({ a: 1 });
  expect(store2.read()).toEqual({ a: 2 });
});