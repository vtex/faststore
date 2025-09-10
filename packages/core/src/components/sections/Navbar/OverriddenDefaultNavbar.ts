import { override } from '../../../customizations/src/components/overrides/Navbar'
import { override as overridePlugin } from '../../../plugins/overrides/Navbar'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'
import Navbar from './Navbar'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Navbar section present in the Headless CMS
 */
export const OverriddenDefaultNavbar = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'Navbar'>),
  ...(override as SectionOverrideDefinitionV1<'Navbar'>),
  Section: Navbar,
})
