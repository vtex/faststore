import { api, tenant } from './api'

interface Options {
  returnUrl?: string
  user?: string
  fingerprint?: string
}

export const startLogin = async ({
  returnUrl = window.origin,
  fingerprint = '',
  user = '',
}: Options) => {
  const form = new FormData()

  form.append('fingerprint', fingerprint)
  form.append('returnUrl', returnUrl)
  form.append('accountName', tenant)
  form.append('scope', tenant)
  form.append('user', user)

  const response = await fetch(api.pub.authentication.startlogin, {
    method: 'POST',
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
    body: form,
  })

  if (response.status > 300) {
    throw new Error('Something went wrong while logging in')
  }
}
