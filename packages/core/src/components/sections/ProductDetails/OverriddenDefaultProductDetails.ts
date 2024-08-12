import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import { override } from 'src/customizations/src/components/overrides/ProductDetails'
import ProductDetails from './ProductDetails'

import type { SectionOverrideDefinitionV1 } from 'app/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductDetails section present in the Headless CMS
 */
export const OverriddenDefaultProductDetails = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'ProductDetails'>),
  Section: ProductDetails,
})
