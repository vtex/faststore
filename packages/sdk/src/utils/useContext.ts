import type { Context } from 'react'
import { useContext as useReactContext } from 'react'

import { SDKError } from './error'

/**
 * @description Like React.useContext but throws when the context's value === undefined.
 * This is useful when you want to force the context to be present in the React's tree before using it
 */

export const useContext = <T>(context: Context<T | undefined>) => {
  const value = useReactContext(context)

  if (value === undefined) {
    throw new SDKError(
      `${context.displayName ?? 'Context'} needs to be on the React tree`
    )
  }

  return value;
};