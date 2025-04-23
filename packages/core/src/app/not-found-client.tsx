'use client'

import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CustomComponents from 'src/customizations/src/components'
import PluginsComponents from 'src/plugins'
import { default as GlobalComponents } from 'src/components/cms/global/Components'
import type { ComponentType } from 'react'

/* A list of components that can be used in the CMS. */
export const NotFoundComponents: Record<string, ComponentType<any>> = {
  ...GlobalComponents,
  EmptyState,
  ...PluginsComponents,
  ...CustomComponents,
}
