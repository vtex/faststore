import type { Context } from 'react'
import { useContext as useReactContext } from 'react'

export const useContext = <T>(context: Context<T | undefined>) => {
  const value = useReactContext(context)

  if (value !== undefined) {
    return value
  }

  throw new Error(
    `${context.displayName ?? 'Context'} needs to be on the React tree`
  )
}
