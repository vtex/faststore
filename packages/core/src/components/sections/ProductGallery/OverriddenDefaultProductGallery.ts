import { override } from 'src/customizations/src/components/overrides/ProductGallery'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import ProductGallery from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductGallery section present in the Headless CMS
 */
export const OverriddenDefaultProductGallery = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'ProductGallery'>),
  Section: ProductGallery,
})
