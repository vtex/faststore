import { api } from './api'

const storeId = process.env.GATSBY_STORE_ID as string

export const getProviders = async () => {
  const search = new URLSearchParams()

  search.append('scope', storeId)
  search.append('accountName', storeId)

  const response = await fetch(api.pub.authentication.startlogin, {
    method: 'GET',
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
  })

  if (response.status > 300) {
    throw new Error('Something went wrong while logging in')
  }

  return response.json().then((providers) => providers as ProvidersResponse)
}

export interface ProvidersResponse {
  passwordAuthentication: boolean
  accessKeyAuthentication: boolean
  oAuthProviders: Provider[]
}

interface Provider {
  providerName: string
}
