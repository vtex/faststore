import { RegionBar as UIRegionBar, Icon as UIIcon } from '@faststore/ui'

import RegionBarCustomizations from 'src/customizations/components/overrides/RegionBar'

const regionBarComponentsCustomization = {}

const regionBarPropsCustomization = {} as any

Object.entries(RegionBarCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    regionBarComponentsCustomization[key] = value.Component
  }
})

Object.entries(RegionBarCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    regionBarPropsCustomization[key] = value.props
  }
})

const Components = {
  RegionBar: UIRegionBar,
  LocationIcon: UIIcon,
  ButtonIcon: UIIcon,
  ...regionBarComponentsCustomization,
}

export { Components, regionBarPropsCustomization as Props }
