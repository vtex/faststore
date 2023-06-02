import {
  Hero as UIHero,
  HeroImage as UIHeroImage,
  HeroHeader as UIHeroHeader,
} from '@faststore/ui'

import HeroCustomizations from 'src/customizations/components/overrides/Hero'

const heroComponentsCustomization = {}

const heroPropsCustomization = {} as any

Object.entries(HeroCustomizations.components).forEach(([key, value]) => {
  if (value.Component) {
    heroComponentsCustomization[key] = value.Component
  }
})

Object.entries(HeroCustomizations.components).forEach(([key, value]) => {
  if (value.props) {
    heroPropsCustomization[key] = value.props
  }
})

const Components = {
  Hero: UIHero,
  HeroImage: UIHeroImage,
  HeroHeader: UIHeroHeader,
  ...heroComponentsCustomization,
}

export { Components, heroPropsCustomization as Props }
