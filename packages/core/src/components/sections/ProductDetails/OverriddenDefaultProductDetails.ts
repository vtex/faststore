import { override } from 'src/customizations/src/components/overrides/ProductDetails'
import { override as overridePlugin } from 'src/plugins/overrides/ProductDetails'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import ProductDetails from './ProductDetails'

import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'

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
