import Alert, { AlertDefaultComponents } from 'src/components/sections/Alert'

import type { DefaultSectionComponentsDefinitions } from 'src/typings/overridesDefinition'
import type { SectionsOverrides } from 'src/typings/overrides'

export const Sections: Partial<
  Record<keyof SectionsOverrides, React.ComponentType<any>>
> = {
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
