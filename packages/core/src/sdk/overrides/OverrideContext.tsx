import { PropsWithChildren, createContext, useContext } from 'react'

import type { OverriddenComponents } from '../../typings/overridesDefinition'
import type { SectionsOverrides } from '../../typings/overrides'

type OverrideContextType<
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
> = {
  className?: string
  components: OverriddenComponents<SectionName>
}

type DefaultComponentsContextType = any

const OverrideContext = createContext<OverrideContextType>(null)
const DefaultComponentsContext =
  createContext<DefaultComponentsContextType>(null)

export const OverrideProvider = OverrideContext.Provider

export function DefaultComponentsProvider(
  props: PropsWithChildren<{ value: DefaultComponentsContextType }>
) {
  const overrideContext = useOverrideContext()

  const components = Object.keys(props.value).reduce((acc, componentName) => {
    const component = overrideContext.components[componentName]
    const defaultComponent = props.value[componentName]
    const Component = component?.Component ?? defaultComponent
    const overrideProps = component?.props ?? {}
    return {
      ...acc,
      [componentName]: {
        Component,
        props: overrideProps,
      },
    }
  }, {})

  return (
    <OverrideContext.Provider
      value={{
        ...overrideContext,
        components,
      }}
    >
      {props.children}
    </OverrideContext.Provider>
  )
}

export const useOverrideContext = <
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>() => useContext(OverrideContext) as OverrideContextType<SectionName>

export const useOverrideComponents = <
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>() =>
  useContext(OverrideContext)
    .components as OverrideContextType<SectionName>['components']

export const useOverrideClassName = () => useContext(OverrideContext)?.className

export const useDefaultComponents = <
  SectionName extends keyof SectionsOverrides = keyof SectionsOverrides
>() => useContext(DefaultComponentsContext) as DefaultComponentsContextType
