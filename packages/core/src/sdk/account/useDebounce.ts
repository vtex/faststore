import { useEffect, useState } from 'react'

export const useDebounce = (
  callback: (value: string) => void,
  delay: number,
  initialValue: string
) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(initialValue)

  useEffect(() => {
    if (debouncedValue === initialValue) return

    const handler = setTimeout(() => {
      callback(debouncedValue)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [debouncedValue])

  return setDebouncedValue
}
