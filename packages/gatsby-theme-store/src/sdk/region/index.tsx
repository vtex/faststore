/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'
import React, { useMemo, useState } from 'react'

type MaybeString = Maybe<string>
export interface RegionContextType {
  postalCode: MaybeString
  regionId: MaybeString
  setPostalCode: (value: MaybeString) => void
  setRegionId: (value: MaybeString) => void
}
export const RegionContext = React.createContext<RegionContextType>({
  postalCode: null,
  regionId: null,
  setPostalCode: (_: MaybeString) => {},
  setRegionId: (_: MaybeString) => {},
})

export const RegionProvider: FC = ({ children }) => {
  const [postalCode, setPostalCode] = useState<MaybeString>(() => {
    const savedPostalCode = window?.localStorage?.getItem('vtex:postalCode')

    return savedPostalCode ?? null
  })

  const [regionId, setRegionId] = useState<MaybeString>(() => {
    const savedRegionId = window?.localStorage?.getItem('vtex:regionId')

    return savedRegionId ?? null
  })

  const contextValue = useMemo(
    () => ({
      postalCode,
      regionId,
      setPostalCode: (value: MaybeString) => {
        if (value) {
          localStorage.setItem('vtex:postalCode', value)
        } else {
          localStorage.removeItem('vtex:postalCode')
        }

        setPostalCode(value)
      },
      setRegionId: (value: MaybeString) => {
        if (value) {
          localStorage.setItem('vtex:regionId', value)
        } else {
          localStorage.removeItem('vtex:regionId')
        }

        setRegionId(value)
      },
    }),
    [postalCode, regionId]
  )

  return (
    <RegionContext.Provider value={contextValue}>
      {children}
    </RegionContext.Provider>
  )
}
