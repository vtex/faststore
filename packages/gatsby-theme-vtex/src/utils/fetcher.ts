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
  return response.json()
}
