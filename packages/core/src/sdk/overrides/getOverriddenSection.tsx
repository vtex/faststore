import type { ComponentProps, ComponentType } from 'react'

import { OverrideProvider } from 'src/sdk/overrides/OverrideContext'
import { DefaultComponents, Sections } from 'src/sdk/overrides/sections'
import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import type {
  DefaultSectionComponentsDefinitions,
  OverriddenComponents,
  SectionOverrideDefinition,
} from 'src/typings/overridesDefinition'
import type { SupportedSectionsOverridesV2 } from 'src/typings/overrides'

/**
 * This function adds OverrideContext to the tree. It is essential for the compatible sections
 * to consume the components it provides.
 */
function createOverriddenSection<
  SectionName extends keyof SupportedSectionsOverridesV2
>({
  Section,
  sectionOverrides,
  id,
}: {
  /** This type wizardry is here because the props won't behave correctly if I do it directly: (typeof Sections)[SectionName] */
  Section: ComponentType<ComponentProps<(typeof Sections)[SectionName]>>
  sectionOverrides: OverriddenComponents<SectionName>
  id?: string
}) {
  const overrideContextValue = { id, components: sectionOverrides }

  return function OverriddenSection(
    props: React.ComponentProps<typeof Section>
  ) {
    return (
      <OverrideProvider value={overrideContextValue}>
        <Section {...props} />
      </OverrideProvider>
    )
  }
}

/**
 * Accepts override options and returns a React component for the overridden section.
 * The overridden section is based on the options specified in the override definition.
 *
 * @param override An object containing override options.
 * @returns The overridden section of choice
 * @see https://www.faststore.dev/docs/building-sections/overriding-components-and-props
 */
export function getOverriddenSection<
  SectionName extends keyof SupportedSectionsOverridesV2
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
