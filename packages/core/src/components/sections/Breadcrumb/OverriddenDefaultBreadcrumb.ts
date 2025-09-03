import { override } from '../../../customizations/src/components/overrides/Breadcrumb'
import { override as overridePlugin } from '../../../plugins/overrides/Breadcrumb'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import Breadcrumb from '.'

import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Breadcrumb section present in the Headless CMS
 */
export const OverriddenDefaultBreadcrumb = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'Breadcrumb'>),
  ...(override as SectionOverrideDefinitionV1<'Breadcrumb'>),
  Section: Breadcrumb,
})
