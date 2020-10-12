import { api } from './api'

interface Options {
  setPreference?: boolean
  login: string
  accessKey: string
  recaptcha?: string
}

export const validateAccessKey = async ({
  recaptcha = '',
  setPreference,
  accessKey,
  login,
}: Options) => {
  const form = new FormData()

  form.append('login', login)
  form.append('accessKey', accessKey)
  form.append('recaptcha', recaptcha)

  const search = new URLSearchParams()

  search.append('setPreference', `${!!setPreference}`)

  const response = await fetch(
    `${api.pub.authentication.accesskey.validate}?${search.toString()}`,
    {
      method: 'POST',
      credentials: 'include',
      body: form,
      headers: {
        accept: 'application/json',
      },
    }
  )

  if (response.status > 300) {
    throw new Error('Something went wrong while logging in')
  }
}
