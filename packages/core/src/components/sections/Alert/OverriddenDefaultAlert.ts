import { override } from '../../../customizations/src/components/overrides/Alert'
import { override as overridePlugin } from '../../../plugins/overrides/Alert'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import Alert from '.'

import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Alert section present in the Headless CMS
 */
export const OverriddenDefaultAlert = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'Alert'>),
  ...(override as SectionOverrideDefinitionV1<'Alert'>),
  Section: Alert,
})
