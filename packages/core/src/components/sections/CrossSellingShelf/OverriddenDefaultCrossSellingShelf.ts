import { override } from 'src/customizations/src/components/overrides/ProductShelf'
import { getOverriddenSection } from 'src/sdk/overrides/getOverriddenSection'
import type { SectionOverrideDefinitionV1 } from 'src/typings/overridesDefinition'
import CrossSellingShelf from '.'

export const OverriddenDefaultCrossSellingShelf = getOverriddenSection({
  ...(override as SectionOverrideDefinitionV1<'CrossSellingShelf'>),
  Section: CrossSellingShelf,
})
