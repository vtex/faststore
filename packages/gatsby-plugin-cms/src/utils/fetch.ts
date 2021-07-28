import unfetch from 'isomorphic-unfetch'
import retry from 'fetch-retry'

const fetch = (input: RequestInfo, init?: RequestInit) =>
  retry(unfetch, {
    retries: 3,
    retryDelay: 500,
  })(input, init)

export default fetch
