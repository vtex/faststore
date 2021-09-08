import fetch from 'isomorphic-unfetch'

export const fetchAPI = async (info: RequestInfo, init?: RequestInit) => {
  const r = Math.random()

  console.time(`${info.toString()}:ramd:${r.toString()}`)

  const response = await fetch(info, init)

  console.timeEnd(`${info.toString()}:ramd:${r.toString()}`)

  if (response.ok) {
    return response.json()
  }

  const text = await response.text()

  console.error(text)
  throw new Error(text)
}
