/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'
import React, { useMemo, useState } from 'react'

export interface RegionContextType {
  postalCode?: null | string
  regionId?: null | string
  // TODO: fix weird string | null | undefined types
  setPostalCode: (value: string | null | undefined) => void
  setRegionId: (value: string | null | undefined) => void
}
export const RegionContext = React.createContext<RegionContextType>({
  postalCode: null,
  regionId: null,
  setPostalCode: (_: string | null | undefined) => {},
  setRegionId: (_: string | null | undefined) => {},
})

export const RegionProvider: FC = ({ children }) => {
  const [postalCode, setPostalCode] = useState<string | null | undefined>(
    () => {
      const savedPostalCode = window?.localStorage?.getItem('vtex:postalCode')

      return savedPostalCode ?? null
    }
  )

  const [regionId, setRegionId] = useState<string | null | undefined>(() => {
    const savedRegionId = window?.localStorage?.getItem('vtex:regionId')

    return savedRegionId ?? null
  })

  const contextValue = useMemo(
    () => ({
      postalCode,
      regionId,
      setPostalCode: (value: string | null | undefined) => {
        if (value) {
          localStorage.setItem('vtex:postalCode', value)
        } else {
          localStorage.removeItem('vtex:postalCode')
        }

        setPostalCode(value)
      },
      setRegionId: (value: string | null | undefined) => {
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
