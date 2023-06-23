import { Breadcrumb as UIBreadcrumb, Icon as UIIcon } from '@faststore/ui'

import BreadcrumbCustomizations from 'src/customizations/components/overrides/Breadcrumb'

const breadcrumbComponentsCustomization = {}

const breadcrumbPropsCustomization = {} as any

Object.entries(BreadcrumbCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    breadcrumbComponentsCustomization[key] = value.Component
  }
})

Object.entries(BreadcrumbCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    breadcrumbPropsCustomization[key] = value.props
  }
})

const Components = {
  Breadcrumb: UIBreadcrumb,
  Icon: UIIcon,
  ...breadcrumbComponentsCustomization,
}

export { Components, breadcrumbPropsCustomization as Props }
