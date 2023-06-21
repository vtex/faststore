import type {
  DefaultSectionComponentsDefinitions,
  GetSectionOverridesReturn,
  ComponentOverrideDefinition,
  SectionOverride,
} from 'src/typings/overrides'

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
        `Mixed use of Component and props overrides detected. Defaulting to Component override. Component ${key} in section ${override.name}`
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
