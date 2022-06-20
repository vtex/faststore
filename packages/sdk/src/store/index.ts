type Subscriber<T> = (value: T) => (void | (() => void));

export interface Store<T> {
  set: (val: T) => void;
  read: () => T;
  subscribe: (sub: Subscriber<T>) => () => void;
}

/**
 * Creates a new Suspense ready Store
 */
export const createStore = <T>(
  initialValue: T,
): Store<T> => {
  const subscribers: Array<{
    send: Subscriber<T>;
    cancel: ReturnType<Subscriber<T>>;
  }> = [];

  let value: T = initialValue;

  const read = () => value;

  const set = (val: T) => {
    value = val;

    for (const subscriber of subscribers) {
      subscriber.cancel?.();
      subscriber.cancel = subscriber.send(val);
    }
  };

  const subscribe = (send: Subscriber<T>) => {
    const index = subscribers.length;

    subscribers.push({ send, cancel: undefined });

    return () => {
      subscribers[index]?.cancel?.();
      subscribers.splice(index, 1);
    };
  };

  return {
    set,
    read,
    subscribe,
  };
};
