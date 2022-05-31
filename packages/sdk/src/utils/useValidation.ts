import { useEffect, useState } from 'react'

interface Options<T> {
  onValidate?: (value: T) => Promise<T | null>
  value: T
  setValue: (value: T) => void
}

const nullable = async () => null

export const createUseValidationHook = () => {
  // Validation queue
  let queue = Promise.resolve()

  const useValidation = <T>({
    onValidate = nullable,
    value,
    setValue,
  }: Options<T>) => {
    const [isValidating, setIsValidating] = useState(true)

    useEffect(() => {
      let cancel = false

      const revalidate = async () => {
        if (cancel) {
          return
        }

        setIsValidating(true)
        const newValue = await onValidate(value)

        if (cancel) {
          return
        }

        setIsValidating(false)
        if (newValue != null) {
          setValue(newValue)
        }
      }

      // Enqueue validation
      setTimeout(() => {
        queue = queue.then(revalidate)
      }, 0)

      return () => {
        cancel = true
      }
    }, [onValidate, setValue, value])

    return isValidating
  }

  return useValidation
}
