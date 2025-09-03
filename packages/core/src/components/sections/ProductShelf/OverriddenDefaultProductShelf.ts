import { override } from '../../../customizations/src/components/overrides/ProductShelf'
import { override as overridePlugin } from '../../../plugins/overrides/ProductShelf'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import ProductShelf from '.'

import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductShelf section present in the Headless CMS
 */
export const OverriddenDefaultProductShelf = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'ProductShelf'>),
  ...(override as SectionOverrideDefinitionV1<'ProductShelf'>),
  Section: ProductShelf,
})
