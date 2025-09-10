import { override } from '../../../customizations/src/components/overrides/ProductDetails'
import { override as overridePlugin } from '../../../plugins/overrides/ProductDetails'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import ProductDetails from './ProductDetails'

import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductDetails section present in the Headless CMS
 */
export const OverriddenDefaultProductDetails = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'ProductDetails'>),
  ...(override as SectionOverrideDefinitionV1<'ProductDetails'>),
  Section: ProductDetails,
})
