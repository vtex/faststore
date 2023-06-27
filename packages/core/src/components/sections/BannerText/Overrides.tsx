import {
  BannerText as UIBannerText,
  BannerTextContent as UIBannerTextContent,
} from '@faststore/ui'

import BannerTextCustomizations from 'src/customizations/components/overrides/BannerText'

const bannerTextComponentsCustomization = {}

const bannerTextPropsCustomization = {} as any

Object.entries(BannerTextCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    bannerTextComponentsCustomization[key] = value.Component
  }
})

Object.entries(BannerTextCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    bannerTextPropsCustomization[key] = value.props
  }
})

const Components = {
  BannerText: UIBannerText,
  BannerTextContent: UIBannerTextContent,
  ...bannerTextComponentsCustomization,
}

export { Components, bannerTextPropsCustomization as Props }
