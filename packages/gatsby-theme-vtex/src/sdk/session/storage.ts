import { Session } from './types'

const SESSION_STORAGE_KEY = 'vtex:session'

interface Payload {
  value: Session | null
  generatedAt: number
}

const ONE_DAY_MS = 86400000

export const storage = {
  get: () => {
    const serialized = localStorage.getItem(SESSION_STORAGE_KEY)
    const payload = serialized ? (JSON.parse(serialized) as Payload) : null

    if (payload) {
      const elapsedTime = Date.now() - payload.generatedAt

      if (elapsedTime < ONE_DAY_MS) {
        return payload.value
      }
    }

    return null
  },
  set: (data: Session | null) => {
    const payload: Payload = {
      value: data,
      generatedAt: Date.now(),
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload))
  },
}
