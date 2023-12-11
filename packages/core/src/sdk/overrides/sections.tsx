import Alert from '../../components/sections/Alert'
import ProductShelf from '../../components/ui/ProductShelf'

import type { DefaultSectionComponentsDefinitions } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'
import { AlertDefaultComponents } from '../../components/sections/Alert/DefaultComponents'
import { ProductShelfDefaultComponents } from '../../components/sections/ProductShelf/DefaultComponents'

export const Sections = {
  Alert,
  ProductShelf,
}

export const DefaultComponents: Partial<
  Record<
    keyof SectionsOverrides,
    DefaultSectionComponentsDefinitions<keyof SectionsOverrides>
  >
> = {
  Alert: AlertDefaultComponents,
  ProductShelf: ProductShelfDefaultComponents,
}
