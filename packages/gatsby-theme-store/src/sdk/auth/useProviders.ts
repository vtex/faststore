import { useEffect, useState } from 'react'

import { getProviders } from './Service/getProviders'
import type { ProvidersResponse } from './Service/getProviders'

export const useProviders = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [data, setData] = useState<ProvidersResponse>()

  useEffect(() => {
    getProviders()
      .then((providersRes) => {
        setData(providersRes)
      })
      .catch((e) => {
        setError(e)
      })
      .finally(() => setLoading(false))
  })

  return { data, loading, error }
}
