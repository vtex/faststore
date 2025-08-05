import { useState, useCallback } from 'react'
import fetch from 'isomorphic-unfetch'

import { buildFormData } from 'src/utils/utilities'

type SetPasswordInput = {
  userEmail: string
  newPassword: string
  currentPassword: string
  accesskey?: string
  recaptcha?: string
}

type SetPasswordResult = {
  success: boolean
  message?: string
}

type SetPasswordState = {
  data: SetPasswordResult | null
  error: Error | null
  loading: boolean
}

type SetPasswordResultType = {
  authStatus?: string
  message?: string
}

export const useSetPassword = (accountName: string) => {
  const [state, setState] = useState<SetPasswordState>({
    data: null,
    error: null,
    loading: false,
  })

  const setPassword = useCallback(async (input: SetPasswordInput) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      await startLogin({ email: input.userEmail, accountName })

      const body = {
        login: input.userEmail,
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        accesskey: !input.accesskey ? null : input.accesskey,
        recaptcha: !input.recaptcha ? null : input.recaptcha,
      }

      const setPasswordUrl = `/api/vtexid/pub/authentication/classic/setpassword?expireSessions=true`

      const response = await fetch(setPasswordUrl, {
        method: 'POST',
        headers: {
          'content-type': 'multipart/form-data',
        },
        body: buildFormData(body),
        credentials: 'include',
      })

      const result: SetPasswordResultType = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to set password')
      }

      setState({
        data: {
          success: result?.authStatus?.toLowerCase() === 'success',
          message: result?.message || 'Password set successfully',
        },
        error: null,
        loading: false,
      })
    } catch (err) {
      console.error('Error setting password:', err?.message || err)

      let authStatus = ''

      try {
        if (err?.message) {
          const error = JSON.parse(err.message) as { authStatus?: string }
          authStatus = error?.authStatus ?? ''
        } else {
          authStatus = 'Unexpected error'
        }
      } catch (error) {
        authStatus = 'Unexpected error while setting password'
      }

      const isInvalidCredentials =
        authStatus.toLowerCase().includes('invalidemail') ||
        authStatus.toLowerCase().includes('invalidpassword')

      setState({
        data: {
          success: false,
          message: isInvalidCredentials
            ? 'Invalid email or password'
            : 'Unexpected error while setting password',
        },
        error: err?.message ? new Error(err.message) : new Error(authStatus),
        loading: false,
      })
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  return {
    setPassword,
    ...state,
  }
}

const startLogin = async ({
  email,
  accountName,
}: {
  email: string
  accountName: string
}) => {
  try {
    const response = await fetch(`/api/vtexid/pub/authentication/startlogin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: buildFormData({
        user: email,
        scope: accountName,
        accountName,
        returnUrl: '/',
        callbackUrl: '/',
        fingerprint: null,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to start login session.')
    }
  } catch (error) {
    console.error('Error starting login:', error?.message || error)
    throw error
  }
}
