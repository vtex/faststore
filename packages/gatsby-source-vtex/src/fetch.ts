import fetch from 'isomorphic-unfetch'

export interface VTEXOptions {
  tenant: string
  workspace: string
  environment: 'vtexcommercestable' | 'vtexcommercebeta'
}

const headers = {
  'content-type': 'application/json',
  accept: 'application/json',
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchRetry<T>(
  path: string,
  init: RequestInit,
  retryCount = 3
): Promise<T> {
  try {
    const response = await fetch(path, init)

    return await response.json()
  } catch (err) {
    if (retryCount === 1) {
      throw err
    }

    await delay(300) // wait for 300ms

    return fetchRetry(path, init, retryCount - 1)
  }
}

export const fetchVTEX = async <T>(
  path: string,
  options: VTEXOptions,
  init?: RequestInit
): Promise<T> => {
  try {
    const url = `https://${options.tenant}.${options.environment}.com.br${path}`

    return await fetchRetry(url, {
      ...init,
      headers: {
        ...headers,
        ...init?.headers,
      },
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
