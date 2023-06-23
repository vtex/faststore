import { EmptyState as UIEmptyState } from '@faststore/ui'

import EmptyStateCustomizations from 'src/customizations/components/overrides/EmptyState'

const emptyStateComponentsCustomization = {}

const emptyStatePropsCustomization = {} as any

Object.entries(EmptyStateCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    emptyStateComponentsCustomization[key] = value.Component
  }
})

Object.entries(EmptyStateCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    emptyStatePropsCustomization[key] = value.props
  }
})

const Components = {
  EmptyState: UIEmptyState,
  ...emptyStateComponentsCustomization,
}

export { Components, emptyStatePropsCustomization as Props }
