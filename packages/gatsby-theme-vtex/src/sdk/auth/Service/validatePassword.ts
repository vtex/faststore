import { api } from './api'

interface Options {
  login: string
  password: string
  recaptcha?: string
  fingerprint?: string
}

export const validatePassword = async ({
  login,
  password,
  recaptcha = '',
  fingerprint = '',
}: Options) => {
  const form = new FormData()

  form.append('login', login)
  form.append('password', password)
  form.append('recaptcha', recaptcha)
  form.append('fingerprint', fingerprint)

  const response = await fetch(api.pub.authentication.classic.validate, {
    method: 'POST',
    credentials: 'include',
    body: form,
    headers: {
      accept: 'application/json',
    },
  })

  if (response.status !== 200) {
    throw new Error('Something went wrong while logging in')
  }
}
