interface Options {
  email: string
  locale?: string
}

export const sendAccessKey = ({ email, locale = '' }: Options) => {
  const form = new FormData()

  form.append('email', email)
  form.append('locale', locale)

  return fetch('api/vtexid/pub/authentication/accesskey/send', {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: form,
  }).then((res) => res.json())
}
