import {
  Button,
  type ButtonProps,
  Icon,
  type IconProps,
  Loader,
  type LoaderProps,
  EmptyState,
  type EmptyStateProps,
} from '@vtex/faststore-ui'
import type { ReactNode } from 'react'
import { merge } from '../utils'

const defaultComponents: ComponentSchema = {
  button: Button,
  loader: Loader,
  icon: Icon,
  'empty-state': EmptyState,
}

class _Theme {
  private components

  constructor(schema: ComponentSchema) {
    this.components = getComponentSpec(schema)
  }

  swizzle(schema: Partial<ComponentSchema>) {
    const customComponents = getComponentSpec(schema)
    const mergedComponents = merge(this.components, customComponents)
    this.components = mergedComponents
  }

  getComponent<K extends keyof ComponentSpec>(key: K): ComponentSpec[K] {
    return this.components[key]
  }
}

function getComponentSpec(schema: Partial<ComponentSchema>): ComponentSpec {
  const spec: Record<string, any> = {}

  Object.keys(schema).forEach((key) => {
    const value = schema[key as keyof typeof schema]
    if (typeof value === 'string') {
      spec[key] = schema[value as keyof typeof schema]
    } else {
      spec[key] = value
    }
  })

  return spec as ComponentSpec
}

type CoreComponents = keyof ComponentSpec

type ComponentSchema = Record<
  CoreComponents,
  CoreComponents | (string & {}) | ((props: any) => ReactNode)
>

interface ComponentSpec {
  button: (props: ButtonProps) => ReactNode
  loader: (props: LoaderProps) => ReactNode
  icon: (props: IconProps) => ReactNode
  'empty-state': (props: EmptyStateProps) => ReactNode
  /** TODO: Add all components */
}

export const Theme = new _Theme(defaultComponents)
