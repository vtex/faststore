'use client'

import { override } from 'src/customizations/src/components/overrides/Navbar'
import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import Navbar from './Navbar'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default Navbar section present in the Headless CMS
 */
export const OverriddenDefaultNavbar = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'Navbar'>),
  Section: Navbar,
})
