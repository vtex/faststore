import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import { override } from 'src/customizations/src/components/overrides/Breadcrumb'
import Breadcrumb from '.'

import type { SectionOverrideDefinitionV1 } from 'app/typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Breadcrumb section present in the Headless CMS
 */
export const OverriddenDefaultBreadcrumb = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'Breadcrumb'>),
  Section: Breadcrumb,
})
