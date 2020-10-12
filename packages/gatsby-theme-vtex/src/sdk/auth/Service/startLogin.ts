const tenant = process.env.GATSBY_VTEX_TENANT as string

interface Options {
  returnUrl?: string
  user: string
  fingerprint?: string
}

export const startLogin = ({
  returnUrl = window.origin,
  fingerprint = '',
  user,
}: Options) => {
  const form = new FormData()

  form.append('fingerprint', fingerprint)
  form.append('returnUrl', returnUrl)
  form.append('accountName', tenant)
  form.append('scope', tenant)
  form.append('user', user)

  return fetch('/api/vtexid/pub/authentication/startlogin', {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: form,
  }).then((res) => res.json())
}
