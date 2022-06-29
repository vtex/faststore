import { useCallback, useState } from 'react'

interface MasterDataResponse {
  Id: string
  Href: string
}

const fetchAPI = async (info: RequestInfo, init?: RequestInit) => {
  const response = await fetch(info, init)

  if (response.ok) {
    return response.status !== 204 ? response.json() : undefined
  }

  console.error(info, init, response)
  const text = await response.text()

  throw new Error(text)
}

const addToNewsletter = async (data: {
  name: string
  email: string
}): Promise<MasterDataResponse> => {
  return fetchAPI(`/api/dataentities/NL/documents/`, {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ ...data, isNewsletterOptIn: true }),
    method: 'PATCH',
  })
}

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MasterDataResponse | null>(null)
  const [error, setError] = useState(false)

  const addUser = useCallback(
    (user: { name: string; email: string }) => {
      setError(false)
      setData(null)
      setLoading(true)

      return addToNewsletter(user)
        .then((response) => {
          setData(response as MasterDataResponse)
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [setError, setData, setLoading]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(false)
    setLoading(false)
  }, [])

  return {
    error,
    addUser,
    loading,
    data,
    reset,
  }
}
