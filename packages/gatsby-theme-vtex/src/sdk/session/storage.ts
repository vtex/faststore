import { Session } from './types'

const SESSION_STORAGE_KEY = 'vtex:session'

export const storage = {
  get: () => {
    const serialized = localStorage.getItem(SESSION_STORAGE_KEY)

    return serialized ? (JSON.parse(serialized) as Session) : null
  },
  set: (data: Session | null) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data))
  },
}
