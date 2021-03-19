/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'
import React, { useState } from 'react'

export interface RegionContextType {
  postalCode?: null | string
  regionId?: null | string
  setPostalCode: (value: string) => void
  setRegionId: (value: string) => void
}
export const RegionContext = React.createContext<RegionContextType>({
  postalCode: null,
  regionId: null,
  setPostalCode: (_: string) => {},
  setRegionId: (_: string) => {},
})

export const RegionProvider: FC = ({ children }) => {
  const [postalCode, setPostalCode] = useState(() => {
    const savedPostalCode = window?.localStorage?.getItem('postalCode')

    return savedPostalCode ?? null
  })

  const [regionId, setRegionId] = useState(() => {
    const savedRegionId = window?.localStorage?.getItem('regionId')

    return savedRegionId ?? null
  })

  return (
    <RegionContext.Provider
      value={{
        postalCode,
        regionId,
        setPostalCode: (value) => {
          localStorage.setItem('postalCode', value)
          setPostalCode(value)
        },
        setRegionId: (value) => {
          localStorage.setItem('regionId', value)
          setRegionId(value)
        },
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}
