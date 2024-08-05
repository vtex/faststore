import type {
  DefaultSectionComponentsDefinitions,
  ComponentOverrideDefinition,
  OverriddenComponents,
  SectionOverrideDefinitionV1,
} from '../../typings/overridesDefinition'

import type { SectionsOverrides } from '../../typings/overrides'

/* TODO: Fix typescript errors. It is necessary to further investigate the typing 
issues of this file. Error lines have been marked with the @ts-expect-error comment*/

export function getSectionOverrides<
  SectionName extends keyof SectionsOverrides
>(
  defaultComponents: DefaultSectionComponentsDefinitions<SectionName>,
  override: SectionOverrideDefinitionV1<SectionName>
): OverriddenComponents<SectionName> {
  const overriddenComponents = {} as OverriddenComponents<SectionName>

  Object.entries<React.ComponentType>(defaultComponents).forEach(
    ([key, value]) => {
      const componentOverride:
        | ComponentOverrideDefinition<React.ComponentType, unknown>
        | undefined =
        // @ts-expect-error
        override.components?.[key]

      if (!componentOverride) {
        // @ts-expect-error
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
        // @ts-expect-error
        overriddenComponents[key] = {
          Component: componentOverride.Component,
          props: {},
        }
      } else {
        // @ts-expect-error
        overriddenComponents[key] = {
          Component: value,
          props: componentOverride.props ?? {},
        }
      }
    }
  )

  return overriddenComponents
}
