type Subscriber<T> = (value: T) => void | Promise<void>;

export interface Store<T> {
  set: (val: T, error?: boolean) => void;
  read: () => T;
  subscribe: (sub: Subscriber<T>) => () => void;
}

export const createStore = <T>(
  subscription: (
    setter: (val: T, error?: boolean) => void | Promise<void>,
  ) => void,
  initialValue?: T,
): Store<T> => {
  const subscribers: Array<Subscriber<T>> = [];

  let resolve: undefined | (() => void);
  const suspender = new Promise<void>((r) => resolve = r);

  let status: "pending" | "success" | "error" = "pending";
  let value: T | undefined = initialValue;

  const set = (val: T, error = false) => {
    value = val;

    for (const sub of subscribers) {
      sub(value);
    }

    if (status === "pending") {
      resolve?.();
    }
    status = error ? "error" : "success";
  };

  const read = (): T => {
    if (value !== undefined) {
      return value;
    }

    if (status === "pending") {
      throw suspender;
    }

    throw value;
  };

  const subscribe = (sub: Subscriber<T>) => {
    const index = subscribers.length;

    subscribers.push(sub);

    return () => {
      subscribers.splice(index, 1);
    };
  };

  subscription(set);

  return {
    set,
    read,
    subscribe,
  };
};
