import { useCallback, useState } from 'react'

type MDResponse = {
  Id: string
  Href: string
  DocumentId: string
}

type NewsletterData = {
  name: string
  email: string
}

const addToNewsletter = async (data: NewsletterData) =>
  fetch('/api/dataentities/NL/documents/', {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/vnd.vtex.ds.v10+json',
    },
    method: 'PATCH',
    body: JSON.stringify({ ...data, isNewsletterOptIn: true }),
  }).then((response) => {
    if (response.ok) {
      return response.json()
    }

    throw new Error()
  })

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MDResponse | null>(null)
  const [error, setError] = useState(false)

  const addUser = useCallback(
    (user: NewsletterData) => {
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
