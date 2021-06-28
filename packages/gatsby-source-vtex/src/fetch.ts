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
  init?: RequestInit,
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

    console.error(
      `[gatsby-source-vtex]: Error while fetching. Retrying...`,
      err
    )

    return fetchRetry(path, init, retryCount - 1)
  }
}

export const fetchGraphQL = async <T>(
  path: string,
  init?: RequestInit
): Promise<{ data: T; errors: any[] }> => {
  let retryCount = 0
  let response: { data: T; errors: any[] } | undefined

  while (retryCount !== 3) {
    response = await fetchRetry<{ data: T; errors: any[] }>(path, init)

    if (!response.errors || response.errors.length === 0) {
      return response
    }

    retryCount += 1
    console.error(
      `[gatsby-source-vtex]: Error while fetching graphql data. Retry ${retryCount}`,
      response.errors
    )
  }

  if (response) {
    for (const error of response.errors) {
      console.error(error)
    }

    throw new Error(
      `[gatsby-source-vtex]: GraphQL Error\n\n: ${response.errors}`
    )
  }

  throw new Error('[gatsby-source-vtex]: Error while fetching graphql data')
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
