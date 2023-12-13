import type { ComponentProps, ComponentType } from 'react'

import { OverrideProvider } from './OverrideContext'
import { DefaultComponents, Sections } from './sections'
import { getSectionOverrides } from './overrides'
import type {
  DefaultSectionComponentsDefinitions,
  OverriddenComponents,
  SectionOverrideDefinition,
} from '../../typings/overridesDefinition'
import type { SupportedSectionsOverridesV2 } from '../../typings/overrides'

/**
 * This function adds OverrideContext to the tree. It is essential for the compatible sections
 * to consume the components it provides.
 */
function createOverriddenSection<
  SectionName extends keyof SupportedSectionsOverridesV2
>({
  Section,
  sectionOverrides,
  className,
}: {
  Section: (typeof Sections)[SectionName]
  sectionOverrides: OverriddenComponents<SectionName>
  className?: string
}) {
  const overrideContextValue = { className, components: sectionOverrides }

  return function OverriddenSection(
    props: React.ComponentProps<typeof Section>
  ) {
    /** This type wizardry is here because the props won't behave correctly if nothing is done */
    const SectionComponent = Section as ComponentType<typeof props>

    return (
      <OverrideProvider value={overrideContextValue}>
        <SectionComponent {...props} />
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
    className: override.className,
  })
}
