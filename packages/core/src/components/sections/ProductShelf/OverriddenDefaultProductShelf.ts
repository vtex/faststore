import { override } from 'src/customizations/src/components/overrides/ProductShelf'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import ProductShelf from '.'

import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductShelf section present in the Headless CMS
 */
export const OverriddenDefaultProductShelf = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'ProductShelf'>),
  Section: ProductShelf,
})
