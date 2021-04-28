import { useContext, useEffect, useState } from 'react'

import { RegionContext } from '.'

export const useRegion = () => {
  const contextValue = useContext(RegionContext)

  const [a, setA] = useState<typeof contextValue>({
    ...contextValue,
    regionId: null,
    postalCode: null,
  })

  useEffect(() => {
    setA(contextValue)
  }, [contextValue])

  return a
}
