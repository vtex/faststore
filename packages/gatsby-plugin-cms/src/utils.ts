import unfetch from 'isomorphic-unfetch'
import retry from 'fetch-retry'

const withRetry = retry(unfetch, {
  retries: 3,
  retryDelay: 1000,
})

export const fetchJson = (input: RequestInfo, init?: RequestInit) =>
  withRetry(input, {
    ...init,
    headers: { accept: 'application/json', ...init?.headers },
  }).then((x) => x.json())
