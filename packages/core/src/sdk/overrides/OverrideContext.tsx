import { createContext, useContext } from 'react'
import { SectionOverride } from 'src/typings/overrides'
import { GetSectionOverridesReturn } from 'src/utils/overrides'

const OverrideContext = createContext({})

export const OverrideProvider = OverrideContext.Provider
export const useOverrideContext = <Section extends SectionOverride>() =>
  useContext(OverrideContext) as GetSectionOverridesReturn<Section>
