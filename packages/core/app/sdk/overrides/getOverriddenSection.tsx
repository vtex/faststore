import { useMemo, type ComponentProps, type ComponentType } from 'react'

import type { SectionsOverrides } from '../../typings/overrides'
import type {
  DefaultSectionComponentsDefinitions,
  SectionOverrideDefinition,
  SectionOverrideDefinitionV1,
} from '../../typings/overridesDefinition'
import { OverrideProvider } from './OverrideContext'
import { getSectionOverrides } from './overrides'

export function getOverridableSection<
  Section extends ComponentType,
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>(
  sectionName: SectionName,
  Section: Section,
  defaultComponents: DefaultSectionComponentsDefinitions<SectionName>
) {
  function OverridableSection(
    propsWithOverrides: ComponentProps<typeof Section> & {
      __overrides?: Omit<SectionOverrideDefinitionV1<SectionName>, 'Section'>
    }
  ) {
    const { __overrides: overrides, ...props } = propsWithOverrides

    const overrideContextValue = useMemo(
      () => ({
        ...(overrides ?? {}),
        components: getSectionOverrides<SectionName>(defaultComponents, {
          ...(overrides ?? {}),
          section: sectionName,
        }),
      }),
      [overrides]
    )

    /** This type wizardry is here because the props won't behave correctly if nothing is done */
    const SectionComponent = Section as ComponentType<ComponentProps<Section>>

    return (
      <OverrideProvider value={overrideContextValue}>
        <SectionComponent {...(props as ComponentProps<typeof Section>)} />
      </OverrideProvider>
    )
  }

  // This type cast is here so the symbol prop doesn't show up in the type definition
  return OverridableSection as Section
}
export function getOverridableServerSection<
  Section extends ComponentType,
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>(
  sectionName: SectionName,
  Section: Section,
  defaultComponents: DefaultSectionComponentsDefinitions<SectionName>
) {
  function OverridableSection(
    propsWithOverrides: ComponentProps<typeof Section> & {
      __overrides?: Omit<SectionOverrideDefinitionV1<SectionName>, 'Section'>
    }
  ) {
    const { __overrides: overrides, ...props } = propsWithOverrides

    const overrideContextValue = useMemo(
      () => ({
        ...(overrides ?? {}),
        components: getSectionOverrides<SectionName>(defaultComponents, {
          ...(overrides ?? {}),
          section: sectionName,
        }),
      }),
      [overrides]
    )

    /** This type wizardry is here because the props won't behave correctly if nothing is done */
    const SectionComponent = Section as ComponentType<ComponentProps<Section>>

    return (
      <SectionComponent
        {...(props as ComponentProps<typeof Section>)}
        context={overrideContextValue.components}
      />
    )
  }

  // This type cast is here so the symbol prop doesn't show up in the type definition
  return OverridableSection as Section
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
  Section extends SectionsOverrides[keyof SectionsOverrides]['Section']
>(override: SectionOverrideDefinition<Section>) {
  const { Section, ...rest } = override

  /** This type wizardry is here because the props won't behave correctly if nothing is done */
  const OverridableSection = Section as ComponentType<ComponentProps<any>>

  return function OverriddenSection(
    props: ComponentProps<typeof OverridableSection>
  ) {
    return <OverridableSection {...props} {...{ __overrides: rest }} />
  }
}
