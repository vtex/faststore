import { useCallback, useState } from 'react'
import useSWR from 'swr'

import {
  clear as clearSession,
  create as createSession,
  patch as patchSession,
} from './controller'
import { storage } from './storage'
import { Session } from './types'

interface Options {
  stale?: boolean
}

export type Action =
  | { type: 'create' }
  | { type: 'clear' }
  | { type: 'patch'; data: any }

export const useSession = (options?: Options) => {
  const [staleData] = useState(() => storage.get())
  const { data, mutate } = useSWR('/api/sessions', {
    fetcher: createSession,
    initialData: options?.stale !== false ? staleData : undefined,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshInterval: Infinity,
    suspense: true,
  })

  const dispatch = useCallback(async (action: Action) => {
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
  }, [])

  return [data, dispatch] as [
    Session | null | undefined,
    (action: Action) => Promise<void>
  ]
}
