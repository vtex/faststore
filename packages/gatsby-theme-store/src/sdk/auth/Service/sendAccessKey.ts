import { api } from './api'

interface Options {
  email: string
  locale?: string
}

export const sendAccessKey = async ({ email, locale = '' }: Options) => {
  const form = new FormData()

  form.append('email', email)
  form.append('locale', locale)

  const response = await fetch(api.pub.authentication.accesskey.send, {
    method: 'POST',
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
    body: form,
  }).then((res) => res.json())

  if (response.status > 300) {
    throw new Error('Something went wrong while sending access key')
  }
}
