import type {
  DefaultSectionComponentsDefinitions,
  ComponentOverrideDefinition,
  SectionOverrideDefinition,
  OverriddenComponents,
} from '../../typings/overridesDefinition'

import type { SectionsOverrides } from '../../typings/overrides'

export function getSectionOverrides<
  SectionName extends keyof SectionsOverrides
>(
  defaultComponents: DefaultSectionComponentsDefinitions<SectionName>,
  override: SectionOverrideDefinition<SectionName>
): OverriddenComponents<SectionName> {
  const overriddenComponents = {} as OverriddenComponents<SectionName>

  Object.entries(defaultComponents).forEach(([key, value]) => {
    const componentOverride:
      | ComponentOverrideDefinition<unknown, unknown>
      | undefined = override.components?.[key]

    if (!componentOverride) {
      overriddenComponents[key] = {
        Component: value,
        props: {},
      }

      return
    }

    if (componentOverride.Component && componentOverride.props) {
      console.warn(
        `Mixed use of Component and props overrides detected. Defaulting to Component override: component ${key} in the ${override.section} section.`
      )
    }

    if (componentOverride.Component) {
      overriddenComponents[key] = {
        Component: componentOverride.Component,
        props: {},
      }
    } else {
      overriddenComponents[key] = {
        Component: value,
        props: componentOverride.props ?? {},
      }
    }
  })

  return overriddenComponents
}
