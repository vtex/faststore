import type { Store } from './base'

const trivial = async () => null

type Validator<T> = (value: T) => Promise<T | null>

export const optimistic = <T>(onValidate: Validator<T> = trivial) => {
  let queue = Promise.resolve()

  return (store: Store<T>) => {
    store.subscribe((value) => {
      let cancel = false

      const handler = async () => {
        if (cancel) {
          return
        }

        const validated = await onValidate(value)

        if (!cancel && validated !== null && validated !== undefined) {
          store.set(validated)
        }
      }

      queue = queue.then(handler).catch((_) => {
        console.error('Error in optimistic validation:', _)
      })

      return () => {
        cancel = true
      }
    })

    return store
  }
}
