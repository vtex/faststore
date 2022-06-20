import { Store } from ".";

const trivial = async () => null;

type Validator<T> = (value: T) => Promise<T | null>;

export const optimisticStore = <T>(onValidate: Validator<T> = trivial) => {
  let queue = Promise.resolve();

  return (store: Store<T>) => {
    store.subscribe((value) => {
      let cancel = false;

      const handler = async () => {
        const validated = await onValidate(value);

        if (!cancel && validated !== null) {
          store.set(validated);
        }
      };

      queue = queue.then(handler);

      return () => {
        cancel = true;
      };
    });

    return store;
  };
};
