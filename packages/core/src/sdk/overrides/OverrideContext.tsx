import { createContext, useContext } from 'react'
import { SectionsOverrides } from 'src/typings/overrides'

const OverrideContext = createContext({})

export const OverrideProvider = OverrideContext.Provider
export const useOverrideContext = <
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>() => useContext(OverrideContext) as SectionsOverrides[SectionName]
