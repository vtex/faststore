import fetch from 'isomorphic-unfetch'

export const fetchAPI = async (info: RequestInfo, init?: RequestInit) => {
  const response = await fetch(info, init)

  if (response.ok) {
    return response.json()
  }

  console.error(info, init, response)
  const text = await response.text()

  throw new Error(text)
}
