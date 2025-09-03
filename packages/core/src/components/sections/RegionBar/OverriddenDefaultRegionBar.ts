import { override } from '../../../customizations/src/components/overrides/RegionBar'
import { override as overridePlugin } from '../../../plugins/overrides/RegionBar'
import { getOverriddenSection } from '../../../sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from '../../../typings/overridesDefinition'
import RegionBar from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default RegionBar section present in the Headless CMS
 */
export const OverriddenDefaultRegionBar = getOverriddenSection({
  ...(overridePlugin as SectionOverrideDefinitionV1<'RegionBar'>),
  ...(override as SectionOverrideDefinitionV1<'RegionBar'>),
  Section: RegionBar,
})
