import type { ComponentType } from 'react'

export type ComponentTypeWithComponentKey<T> = ComponentType<T> & {
  $componentKey?: string
}

export const getComponentKey = (
  Component: ComponentTypeWithComponentKey<any>,
  name: string
) => Component.$componentKey ?? name
