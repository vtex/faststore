import { Store } from ".";

const queue = Promise.resolve();

export const optimistic = <T>(
  store: Store<T>,
  onValidate: (value: T) => Promise<T | null>,
) =>
  store.subscribe(async (value) => {
    const validated = await queue.then(
      () => onValidate(value),
    );

    if (validated !== null) {
      store.set(validated);
    }
  });
