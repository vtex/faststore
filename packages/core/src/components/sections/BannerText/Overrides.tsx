import {
  Banner as UIBanner,
  BannerContent as UIBannerContent,
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
  Banner: UIBanner,
  BannerContent: UIBannerContent,
  ...bannerTextComponentsCustomization,
}

export { Components, bannerTextPropsCustomization as Props }
