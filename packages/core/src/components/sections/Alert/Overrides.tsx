import { Alert as UIAlert, Icon as UIIcon } from '@faststore/ui'

import AlertCustomizations from 'src/customizations/components/overrides/Alert'

const alertComponentsCustomization = {}

const alertPropsCustomization = {} as any

Object.entries(AlertCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    alertComponentsCustomization[key] = value.Component
  }
})

Object.entries(AlertCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    alertPropsCustomization[key] = value.props
  }
})

const Components = {
  Alert: UIAlert,
  Icon: UIIcon,
  ...alertComponentsCustomization,
}

export { Components, alertPropsCustomization as Props }
