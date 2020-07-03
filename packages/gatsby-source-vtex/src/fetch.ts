import fetch from 'isomorphic-unfetch'

export interface VTEXOptions {
  tenant: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
}

const headers = {
  'content-type': 'application/json',
  accept: 'application/json',
}

export const fetchVTEX = async <T>(
  path: string,
  options: VTEXOptions,
  init?: RequestInit
) => {
  const url = `https://${options.tenant}.${options.environment}.com.br${path}`
  const response = await fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers,
    },
  })
  return response.json() as Promise<T>
}
