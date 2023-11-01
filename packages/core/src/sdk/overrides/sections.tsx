import Alert, { AlertDefaultComponents } from 'src/components/sections/Alert'

import type { DefaultSectionComponentsDefinitions } from 'src/typings/overridesDefinition'
import type { SectionsOverrides } from 'src/typings/overrides'

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
