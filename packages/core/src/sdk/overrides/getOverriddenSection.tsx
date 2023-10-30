import Alert from 'src/components/sections/Alert'
import { DefaultSectionComponentsDefinitions } from 'src/typings/overrideDefinitionUtils'
import { SectionOverride, SectionsOverrides } from 'src/typings/overrides'
import {
  GetSectionOverridesReturn,
  getSectionOverrides,
} from 'src/utils/overrides'
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

function createOverriddenSection({
  Section,
  sectionOverrides,
}: {
  Section: React.ElementType
  sectionOverrides: GetSectionOverridesReturn<SectionOverride>
}) {
  return function OverriddenSection(props: any) {
    return (
      <OverrideProvider value={sectionOverrides}>
        <Section {...props} />
      </OverrideProvider>
    )
  }
}

export function getOverriddenSection<SO extends SectionOverride>(override: SO) {
  const defaultComponents = DefaultComponents[override.section]

  if (!defaultComponents) {
    throw new Error(
      `Section ${override.section} does not exist. Please provide a valid section name to override.`
    )
  }

  const sectionOverrides = getSectionOverrides(defaultComponents, override)

  return createOverriddenSection({
    Section: Sections[override.section],
    sectionOverrides: sectionOverrides,
  })
}
