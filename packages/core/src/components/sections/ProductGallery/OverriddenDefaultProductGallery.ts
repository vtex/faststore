import { override } from '../../../customizations/src/components/overrides/ProductGallery'
import { override as overridePlugin } from '../../../plugins/overrides/ProductGallery'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'
import ProductGallery from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductGallery section present in the Headless CMS
 */
export const OverriddenDefaultProductGallery = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'ProductGallery'>),
  ...(override as SectionOverrideDefinitionV1<'ProductGallery'>),
  Section: ProductGallery,
})
