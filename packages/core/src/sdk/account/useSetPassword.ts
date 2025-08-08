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

type SetPasswordResultType = {
  authStatus?: string
  message?: string
}

const AUTH_STATUS = {
  SUCCESS: 'success',
  INVALID_EMAIL: 'invalidemail',
  INVALID_PASSWORD: 'invalidpassword',
  WRONG_CREDENTIALS: 'wrongcredentials',
  UNEXPECTED_ERROR: 'unexpectederror',
  NO_RESPONSE: 'noresponse',
  FAILED: 'failed',
}

const authMessage = {
  [AUTH_STATUS.SUCCESS]: 'Password set successfully',
  [AUTH_STATUS.INVALID_EMAIL]: 'Invalid email or password',
  [AUTH_STATUS.INVALID_PASSWORD]: 'Invalid email or password',
  [AUTH_STATUS.WRONG_CREDENTIALS]: 'Wrong credentials',
  [AUTH_STATUS.UNEXPECTED_ERROR]: 'Unexpected error. Please try again later.',
  [AUTH_STATUS.NO_RESPONSE]: 'No response from set password API',
  [AUTH_STATUS.FAILED]: 'Failed to set password',
}

export const useSetPassword = (accountName?: string) => {
  const [loading, setLoading] = useState<boolean>(false)

  const setPassword = useCallback(async (input: SetPasswordInput) => {
    setLoading(true)

    try {
      await startLogin({ email: input.userEmail, accountName })

      const body = {
        login: input.userEmail,
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        accesskey: !input.accesskey ? null : input.accesskey,
        recaptcha: !input.recaptcha ? null : input.recaptcha,
      }

      const response = await fetch(
        `/api/vtexid/pub/authentication/classic/setpassword?expireSessions=true`,
        {
          method: 'POST',
          body: buildFormData(body),
          credentials: 'include',
        }
      )

      if (!response.ok) {
        setLoading(false)

        return {
          success: false,
          message: authMessage[AUTH_STATUS.UNEXPECTED_ERROR],
        }
      }

      const result: SetPasswordResultType = await response.json()

      if (!result) {
        setLoading(false)

        return {
          success: false,
          message: authMessage[AUTH_STATUS.NO_RESPONSE],
        }
      }

      const authStatus = result?.authStatus
        ? result.authStatus.toLowerCase()
        : AUTH_STATUS.UNEXPECTED_ERROR

      return {
        success: authStatus === AUTH_STATUS.SUCCESS,
        message: authMessage[authStatus] || 'Unexpected error occurred',
      }
    } catch (err) {
      console.error('Error setting password:', err)

      const authStatus =
        typeof err === 'object' && err !== null && 'authStatus' in err
          ? String(err.authStatus).toLowerCase()
          : AUTH_STATUS.UNEXPECTED_ERROR

      return {
        success: false,
        message: authMessage[authStatus] || 'Unexpected error occurred',
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return { setPassword, loading }
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
        response: {
          status: response.status,
          statusText: response.statusText,
        },
      }
    }
  } catch (error) {
    console.error('Error starting login:', error)
    throw error
  }
}
