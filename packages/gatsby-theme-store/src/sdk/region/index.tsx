/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'
import React, { useEffect, useMemo, useState } from 'react'

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
  const [postalCode, setPostalCode] = useState<MaybeString>()
  const [regionId, setRegionId] = useState<MaybeString>()

  // Set using useEffect instead on the initial useState setup
  // to prevent issues with hydration mismatch.
  useEffect(() => {
    const savedPostalCode = window?.localStorage?.getItem('vtex:postalCode')
    const savedRegionId = window?.localStorage?.getItem('vtex:regionId')

    setPostalCode(savedPostalCode ?? null)
    setRegionId(savedRegionId ?? null)
  }, [])

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
