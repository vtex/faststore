import { useContext } from 'react'

import { Context } from './Provider'

export const useSession = () => {
  const payload = useContext(Context)

  if (!payload) {
    throw new Error('No <SessionProvider/> component found in your React tree')
  }

  return payload
}
