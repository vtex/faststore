import { override } from 'src/customizations/src/components/overrides/Alert'
import { override as overridePlugin } from 'src/plugins/overrides/Alert'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import Alert from '.'

import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'

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
