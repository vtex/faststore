import { useCallback, useState } from 'react'

type MDResponse = {
  Id: string
  Href: string
  DocumentId: string
}

const addToNewsletter = async (data: { name: string; email: string }) =>
  fetch('/api/dataentities/NL/documents/', {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/vnd.vtex.ds.v10+json',
    },
    method: 'PATCH',
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    throw new Error()
  })

const useNewsletter = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MDResponse | null>(null)
  const [error, setError] = useState(false)

  const addUser = useCallback(
    (user: { name: string; email: string }) => {
      setError(false)
      setData(null)
      setLoading(true)

      return addToNewsletter(user)
        .then((response) => {
          setData(response as MDResponse)
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

export default useNewsletter
