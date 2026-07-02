import { type Reconcile, persisted } from './persisted'
import { optimistic } from './optimistic'
import { singleton } from './singleton'
import { compose } from '../utils/compose'
import { createStore as createBaseStore } from './base'

const identity = <T>(x: T) => x

export interface CreateStoreOptions<T> {
  /**
   * Reconciles values read from IDB (on hydration and cross-tab sync) with the
   * current in-memory value. Use it to protect fields with an external source
   * of truth (e.g. URL-derived locale) from being overwritten by a stale
   * persisted payload.
   */
  reconcile?: Reconcile<T>
}

export const createStore = <T>(
  initialValue: T,
  namespace?: string,
  onValidate?: (value: T) => Promise<T | null>,
  options?: CreateStoreOptions<T>
) => {
  return compose(
    [
      namespace ? singleton(namespace) : identity,
      namespace ? persisted(namespace, options?.reconcile) : identity,
      onValidate ? optimistic(onValidate) : identity,
    ],
    createBaseStore(initialValue)
  )
}
