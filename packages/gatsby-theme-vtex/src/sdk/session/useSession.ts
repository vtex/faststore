import { useContext } from 'react'

import { Action, Context } from './Provider'

export const useSession = () => {
  const payload = useContext(Context)

  if (!payload) {
    // Server side rendering, return null content
    return {
      value: null,
      dispatch: (_: Action) => {
        throw new Error(
          'No <SessionProvider/> component found in your React tree. Make sure you are not dispatching a session change during Server Side Rendering'
        )
      },
    }
  }

  return payload
}
