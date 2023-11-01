import { createContext, useContext } from 'react'

import { SectionsOverrides } from 'src/typings/overrides'
import { OverriddenComponents } from 'src/utils/overrides'

type OverrideContextType<
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
> = {
  id?: string
  components: OverriddenComponents<SectionName>
}

const OverrideContext = createContext<OverrideContextType>(null)

export const OverrideProvider = OverrideContext.Provider

export const useOverrideContext = <
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>() => useContext(OverrideContext) as OverrideContextType<SectionName>

export const useOverrideComponents = <
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>() =>
  useContext(OverrideContext)
    .components as OverrideContextType<SectionName>['components']

export const useOverrideId = () => useContext(OverrideContext)?.id
