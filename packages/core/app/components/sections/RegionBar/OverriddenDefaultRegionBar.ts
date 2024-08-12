import { override } from 'src/customizations/src/components/overrides/RegionBar'
import { getOverriddenSection } from 'app/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import RegionBar from '.'

/**
 * This component exists to support overrides 1.0
 *
 * This allows users to override the default RegionBar section present in the Headless CMS
 */
export const OverriddenDefaultRegionBar = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'RegionBar'>),
  Section: RegionBar,
})
