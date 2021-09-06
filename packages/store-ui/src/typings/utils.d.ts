import type { ArgType } from '@storybook/react'

export type ComponentArgTypes<T> = {
  [K in keyof T]: ArgType
}
