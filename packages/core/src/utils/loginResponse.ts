export interface LoginResponse {
  success?: boolean
  redirectUrl?: string
  error?: string
}

export const isLoginResponse = (data: unknown): data is LoginResponse => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false
  }

  const payload = data as Record<string, unknown>

  return (
    (payload.success === undefined || typeof payload.success === 'boolean') &&
    (payload.redirectUrl === undefined ||
      typeof payload.redirectUrl === 'string') &&
    (payload.error === undefined || typeof payload.error === 'string')
  )
}
