export interface UnlockResponse {
  success?: boolean
  redirectUrl?: string
  error?: string
}

export const isUnlockResponse = (data: unknown): data is UnlockResponse => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false
  }

  const payload = data as Record<string, unknown>
  const hasUnlockResponseField =
    payload.success !== undefined ||
    payload.redirectUrl !== undefined ||
    payload.error !== undefined

  return (
    hasUnlockResponseField &&
    (payload.success === undefined || typeof payload.success === 'boolean') &&
    (payload.redirectUrl === undefined ||
      typeof payload.redirectUrl === 'string') &&
    (payload.error === undefined || typeof payload.error === 'string')
  )
}
