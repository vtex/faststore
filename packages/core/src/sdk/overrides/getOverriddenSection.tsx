import { OverrideProvider } from 'src/sdk/overrides/OverrideContext'
import { DefaultComponents, Sections } from 'src/sdk/overrides/sections'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'

import type {
  DefaultSectionComponentsDefinitions,
  OverriddenComponents,
  SectionOverrideDefinition,
} from 'src/typings/overridesDefinition'
import type { SectionsOverrides } from 'src/typings/overrides'

function createOverriddenSection<SectionName extends keyof SectionsOverrides>({
  Section,
  sectionOverrides,
  id,
}: {
  Section: React.ElementType
  sectionOverrides: OverriddenComponents<SectionName>
  id?: string
}) {
  const overrideContextValue = { id, components: sectionOverrides }

  return function OverriddenSection(props: any) {
    return (
      <OverrideProvider value={overrideContextValue}>
        <Section {...props} />
      </OverrideProvider>
    )
  }
}

export function getOverriddenSection<
  SectionName extends keyof SectionsOverrides
>(override: SectionOverrideDefinition<SectionName>) {
  const defaultComponents = DefaultComponents[
    override.section
  ] as DefaultSectionComponentsDefinitions<SectionName>

  if (!defaultComponents) {
    throw new Error(
      `Section ${override.section} does not exist. Please provide a valid section name to override.`
    )
  }

  const sectionOverrides = getSectionOverrides(defaultComponents, override)

  return createOverriddenSection({
    Section: Sections[override.section],
    sectionOverrides: sectionOverrides,
    id: override.id,
  })
}
