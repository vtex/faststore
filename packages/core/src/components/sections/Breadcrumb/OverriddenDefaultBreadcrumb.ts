import { override } from 'src/customizations/src/components/overrides/Breadcrumb'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import Breadcrumb from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Breadcrumb section present in the Headless CMS
 */
export const OverriddenDefaultBreadcrumb = getOverriddenSection({
  ...override,
  Section: Breadcrumb,
})
