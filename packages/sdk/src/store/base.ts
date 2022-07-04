type CancelFn = () => void;

type Subscriber<T> = (value: T) => void | CancelFn;

export interface Store<T> {
  set: (val: T) => void;
  read: () => T;
  readInitial: () => T;
  subscribe: (sub: Subscriber<T>) => () => void;
}

/**
 * Creates a new Suspense ready Store
 */
export const createStore = <T>(
  initialValue: T,
): Store<T> => {
  const subscribers = new Set<Subscriber<T>>();
  const cancelations = new Set<CancelFn>();

  let value: T = initialValue;

  const read = () => value;

  const readInitial = () => initialValue;

  const set = (val: T) => {
    value = val;

    // Cancel previous, dangling operations
    cancelations.forEach((cancel) => cancel());
    cancelations.clear();

    // Broadcast subscribers
    subscribers.forEach((sub) => {
      const cancel = sub(val);

      if (typeof cancel === "function") {
        cancelations.add(cancel);
      }
    });
  };

  const subscribe = (sub: Subscriber<T>) => {
    subscribers.add(sub);

    return () => {
      subscribers.delete(sub);
    };
  };

  return {
    set,
    read,
    readInitial,
    subscribe,
  };
};