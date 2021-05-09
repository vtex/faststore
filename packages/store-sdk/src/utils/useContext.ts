import type { Context } from 'react'
import { useContext as useReactContext } from 'react'

/**
 * @description Like React.useContext but throws when the context's value === undefined.
 * This is usefull when you want to force the context to be present in the React's tree before using it
 */
export const useContext = <T>(context: Context<T | undefined>) => {
  const value = useReactContext(context)

  if (value !== undefined) {
    return value
  }

  throw new Error(
    `${context.displayName ?? 'Context'} needs to be on the React tree`
  )
}
