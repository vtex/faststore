import { useState, useCallback } from 'react'
import fetch from 'isomorphic-unfetch'
import { buildFormData } from 'src/utils/utilities'
import config from '../../../discovery.config'

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

export const useSetPassword = (accountName?: string) => {
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
        body: buildFormData(body),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(
          `Failed to set password: ${response.status} ${response.statusText}`
        )
      }

      const result: SetPasswordResultType = (await response.json()) ?? {
        authStatus: 'Unexpected error',
        message: 'Unexpected error while setting password',
      }

      if (!result) {
        const fallback = {
          success: false,
          message: 'No response from set password API',
        }

        setState({
          data: fallback,
          loading: false,
          error: new Error(fallback.message),
        })

        return fallback
      }

      setState({
        data: {
          success: result?.authStatus?.toLowerCase() === 'success',
          message: 'Password set successfully',
        },
        error: null,
        loading: false,
      })

      return {
        success: result?.authStatus
          ? result?.authStatus.toLowerCase() === 'success'
          : false,
        message: 'Password set successfully',
      }
    } catch (err) {
      console.error('Error setting password:', err)

      const authStatus =
        typeof err === 'object' && err !== null && 'authStatus' in err
          ? String(err.authStatus)
          : 'Unexpected error'

      const isInvalidCredentials =
        authStatus.toLowerCase().includes('invalidemail') ||
        authStatus.toLowerCase().includes('invalidpassword')

      const errorResult = {
        success: false,
        message: isInvalidCredentials
          ? 'Invalid email or password'
          : 'Unexpected error while setting password',
      }

      setState({
        data: errorResult,
        error: new Error('Failed to set password'),
        loading: false,
      })

      return errorResult
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  return {
    setPassword,
    error: state.error,
    data: state.data,
    loading: state.loading,
  }
}

const startLogin = async ({
  email,
  accountName,
}: {
  email: string
  accountName?: string
}) => {
  try {
    const response = await fetch(`/api/vtexid/pub/authentication/startlogin`, {
      method: 'POST',
      credentials: 'include',
      body: buildFormData({
        user: email,
        scope: accountName ?? config.api.storeId,
        accountName: accountName ?? config.api.storeId,
        returnUrl: '/',
        callbackUrl: '/',
        fingerprint: null,
      }),
    })

    if (!response.ok) {
      throw {
        response: {},
      }
    }
  } catch (error) {
    console.error('Error starting login:', error)
    throw error
  }
}
