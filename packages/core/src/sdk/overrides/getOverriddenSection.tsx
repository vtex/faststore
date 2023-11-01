import Alert from 'src/components/sections/Alert'
import { DefaultSectionComponentsDefinitions } from 'src/typings/overrideDefinitionUtils'
import {
  SectionOverride,
  SectionOverrideDefinition,
  SectionsOverrides,
} from 'src/typings/overrides'
import { OverriddenComponents, getSectionOverrides } from 'src/utils/overrides'
import { OverrideProvider } from './OverrideContext'
import { defaultComponents as alertDefaultComponents } from 'src/components/sections/Alert/Overrides'

const Sections: Partial<
  Record<SectionOverride['section'], React.ComponentType<any>>
> = {
  Alert,
}

const DefaultComponents: Partial<
  Record<
    keyof SectionsOverrides,
    DefaultSectionComponentsDefinitions<keyof SectionsOverrides>
  >
> = {
  Alert: alertDefaultComponents,
}

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
