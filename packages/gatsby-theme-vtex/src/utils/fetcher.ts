const headers = {
  'content-type': 'application/json',
  accept: 'application/json',
}

export const jsonFetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: { ...headers, ...init?.headers },
  })
  if (response.status < 200 || response.status >= 300) {
    const message = await response.json()
    throw new Error(message.toString())
  }
  return response.json()
}
