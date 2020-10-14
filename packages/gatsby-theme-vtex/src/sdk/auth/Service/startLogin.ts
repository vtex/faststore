import { api, tenant } from './api'

interface Options {
  fingerprint?: string
  callbackUrl?: string
  returnUrl?: string
  user?: string
}

export const startLogin = async ({
  returnUrl = `${window.origin}/`,
  callbackUrl = '',
  fingerprint = '',
  user = '',
}: Options) => {
  const form = new FormData()

  form.append('fingerprint', fingerprint)
  form.append('callbackUrl', callbackUrl)
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
