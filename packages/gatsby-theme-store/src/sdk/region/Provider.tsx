import React, { createContext, useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'

import controller from './controller'

export interface IContext {
  postalCode: Maybe<string>
  regionId: Maybe<string>
  setPostalCode: (value: Maybe<string>) => void
  setRegionId: (value: Maybe<string>) => void
  loading?: boolean
}

export const Context = createContext<IContext>({
  postalCode: null,
  regionId: null,
  setPostalCode: () => {
    console.error('setPostalCode has been called outside a Region Provider. This is a noop. Please insert the caller component inside a Region Provider')
  },
  setRegionId: () => {
    console.error('setRegionId has been called outside a Region Provider. This is a noop. Please insert the caller component inside a Region Provider')
  },
  loading: true,
})

export const Provider: FC = ({ children }) => {
  const [postalCode, setPostalCode] = useState<Maybe<string>>(null)
  const [regionId, setRegionId] = useState<Maybe<string>>(null)
  const [isLoading, setLoading] = useState(true)

  const value = useMemo(
    () => ({
      postalCode,
      regionId,
      setPostalCode: (val: Maybe<string>) => {
        controller.postalCode.set(val)
        setPostalCode(val)
      },
      setRegionId: (val: Maybe<string>) => {
        controller.region.set(val)
        setRegionId(val)
      },
      loading: isLoading,
    }),
    [postalCode, regionId, isLoading]
  )

  useEffect(() => {
    setPostalCode(controller.postalCode.get())
    setRegionId(controller.region.get())
    setLoading(false)
  }, [])

  return <Context.Provider value={value}>{children}</Context.Provider>
}
