const headers = {
  'content-type': 'application/json',
  accept: 'application/json',
}

export const successFetcher = async (
  input: RequestInfo,
  init?: RequestInit | undefined
) => {
  const response = await fetch(input, init)

  if (response.status < 200 || response.status >= 300) {
    const message = await response.json()

    throw new Error(message.toString())
  }

  return response
}

export const rawJsonFetcher = async (
  input: RequestInfo,
  init?: RequestInit | undefined
) => {
  const response = await successFetcher(input, {
    ...init,
    headers: { ...headers, ...init?.headers },
  })

  return response
}

export const jsonFetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => {
  const response = await rawJsonFetcher(input, init)

  return response.json()
}

export const postFetcher = async <T extends any>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => jsonFetcher(input, { method: 'POST', ...init })
