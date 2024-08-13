import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import { override } from 'src/customizations/src/components/overrides/ProductShelf'
import ProductShelf from '.'

import type { SectionOverrideDefinitionV1 } from 'app/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductShelf section present in the Headless CMS
 */
export const OverriddenDefaultProductShelf = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'ProductShelf'>),
  Section: ProductShelf,
})
