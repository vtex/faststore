import type {
  DefaultSectionComponentsDefinitions,
  ComponentOverrideDefinition,
  Merge,
} from 'src/typings/overrideDefinitionUtils'

import type { SectionOverride } from 'src/typings/overrides'

export type GetSectionOverridesReturn<SO extends SectionOverride> = {
  [Key in keyof SO['components']]: Merge<SO['components'][Key]>
}

export function getSectionOverrides<SO extends SectionOverride>(
  defaultComponents: DefaultSectionComponentsDefinitions<SO>,
  override: SO
): GetSectionOverridesReturn<SO> {
  const overriddenComponents = {} as GetSectionOverridesReturn<SO>

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
