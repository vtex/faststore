import { waitFor } from "./../waitFor";
import { createBaseStore, optimistic } from "../../src";

const getStore = <T>(initial: T, onValidate: (x: T) => Promise<T | null>) =>
  optimistic<T>(onValidate)(createBaseStore(initial));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const onValidate = jest.fn(async (x) => {
  await sleep(500);
  return x < 2 ? x + 1 : null;
});

test("Optmistic Store: Calls validation function", async () => {
  onValidate.mockClear()
  const store = getStore(0, onValidate);

  store.set(1);

  // Waits for onValidate to be called
  await waitFor(() => expect(store.read()).toEqual(2));

  expect(onValidate).toBeCalledTimes(2);
});

test("Optmistic Store: Debounces validation function calls", async () => {
  onValidate.mockClear()
  const store = getStore(0, onValidate);

  store.set(0);

  await sleep(100);
  store.set(0);

  await sleep(100);
  store.set(0);

  await sleep(100);
  store.set(1);

  await waitFor(() => expect(store.read()).toEqual(2));

  expect(onValidate).toBeCalledTimes(3);
});
