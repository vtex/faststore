import type { ArgTypes } from '@storybook/react'

export type ComponentArgTypes<T> = {
  [K in keyof T]: ArgTypes
}
