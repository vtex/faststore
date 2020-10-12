import { api } from './api'

interface Options {
  login: string
  newPassword: string
  currentPassword?: string
  accesskey?: string
  recaptcha?: string
}

export const setPassword = async ({
  login,
  newPassword,
  currentPassword = '',
  accesskey = '',
  recaptcha = '',
}: Options) => {
  const form = new FormData()

  form.append('login', login)
  form.append('newPassword', newPassword)
  form.append('currentPassword', currentPassword)
  form.append('accesskey', accesskey)
  form.append('recaptcha', recaptcha)

  const response = await fetch(api.pub.authentication.classic.setpassword, {
    method: 'POST',
    credentials: 'include',
    body: form,
    headers: {
      accept: 'application/json',
    },
  })

  if (response.status > 300) {
    throw new Error('Something went wrong while logging in')
  }
}
