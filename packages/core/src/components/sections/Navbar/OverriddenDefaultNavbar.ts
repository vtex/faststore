import { override } from 'src/customizations/src/components/overrides/Navbar'
import { override as overridePlugin } from 'src/plugins/overrides/Navbar'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
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
