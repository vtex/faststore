import { api } from './api'

interface Options {
  fingerprint?: string
  callbackUrl?: string
  user?: string
  returnUrl: string
}

const storeId = process.env.GATSBY_STORE_ID as string

export const startLogin = async ({
  returnUrl,
  callbackUrl = '',
  fingerprint = '',
  user = '',
}: Options) => {
  const form = new FormData()

  form.append('fingerprint', fingerprint)
  form.append('callbackUrl', callbackUrl)
  form.append('returnUrl', returnUrl)
  form.append('accountName', storeId)
  form.append('scope', storeId)
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
