import { persisted } from "./persisted";
import { optimistic } from "./optimistic";
import { singleton } from "./singleton";
import { compose } from "../utils/compose";
import { createStore as createBaseStore } from "./base";

const identity = <T>(x: T) => x;

export const createStore = <T>(
  initialValue: T,
  namespace?: string,
  onValidate?: (value: T) => Promise<T | null>,
) => {
  return compose([
    namespace ? singleton(namespace) : identity,
    namespace ? persisted(namespace) : identity,
    onValidate ? optimistic(onValidate) : identity,
  ], createBaseStore(initialValue));
};