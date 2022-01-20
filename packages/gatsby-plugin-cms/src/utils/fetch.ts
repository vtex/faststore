import unfetch from 'isomorphic-unfetch'
import retry from 'fetch-retry'

export const fetch = (input: RequestInfo, init?: RequestInit) =>
  retry(unfetch, {
    retries: 3,
    retryDelay: 500,
  })(input, init)

export const fetchAPI = async <T>(input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, init)

  if (response.ok) {
    return response.json() as Promise<T>
  }

  console.error(await response.text())

  throw new Error(`Error while fetching ${input}`)
}
