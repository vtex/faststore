import { useCallback, useEffect } from 'react'
import useSWR from 'swr'

import {
  clear as clearSession,
  create as createSession,
  patch as patchSession,
} from './controller'
import { storage } from './storage'
import { Session } from './types'

export interface Options {
  stale?: boolean
}

export type Action =
  | { type: 'create' }
  | { type: 'clear' }
  | { type: 'patch'; data: any }

const initialData = storage.get()

export const useSession = (options?: Options) => {
  const fresh =
    options?.stale === false ||
    initialData?.namespaces.profile?.isAuthenticated?.value === 'true'

  // Uses different keys for different freshness of the data
  // So we never mess stale with fresh data
  const key = `/api/sessions?fresh=${fresh}`

  const { data, mutate } = useSWR(key, {
    fetcher: createSession,
    initialData: fresh ? undefined : initialData,
    revalidateOnFocus: fresh,
    revalidateOnMount: fresh,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    suspense: true,
  })

  useEffect(() => {
    if (data !== undefined) {
      storage.set(data)
    }
  }, [data])

  const dispatch = useCallback(
    async (action: Action) => {
      let session = null

      if (action.type === 'create') {
        session = await createSession()
      }

      if (action.type === 'clear') {
        await clearSession()
      }

      if (action.type === 'patch') {
        session = await patchSession(action.data)
      }

      storage.set(session)
      mutate(session)
    },
    [mutate]
  )

  return [data, dispatch] as [
    Session | null | undefined,
    (action: Action) => Promise<void>
  ]
}
