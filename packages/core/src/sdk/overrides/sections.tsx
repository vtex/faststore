import Alert from '../../components/sections/Alert'

import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'
import { AlertDefaultComponents } from '../../components/sections/Alert/DefaultComponents'

export const Sections = {
  Alert,
}

export const DefaultComponents: Partial<
  Record<
    keyof SectionsOverrides,
    DefaultSectionComponentsDefinitions<keyof SectionsOverrides>
  >
> = {
  Alert: AlertDefaultComponents,
}
