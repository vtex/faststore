import { override } from 'src/customizations/src/components/overrides/ProductDetails'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import ProductDetails from './ProductDetails'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default ProductDetails section present in the Headless CMS
 */
export const OverriddenDefaultProductDetails = getOverriddenSection({
  ...override,
  Section: ProductDetails,
})
