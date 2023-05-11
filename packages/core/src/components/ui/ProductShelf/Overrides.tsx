import ProductCard from '../../product/ProductCard'
import Carousel from '../../ui/Carousel'

import ProductShelfCustomizations from 'src/customizations/components/overrides/ProductShelf'

const productShelfComponentsCustomization = {}

const productShelfPropsCustomization = {} as any

Object.entries(ProductShelfCustomizations.components).forEach(
  ([key, value]) => {
    if (value.Component) {
      productShelfComponentsCustomization[key] = value.Component
    }
  }
)

Object.entries(ProductShelfCustomizations.components).forEach(
  ([key, value]) => {
    if (value.props) {
      productShelfPropsCustomization[key] = value.props
    }
  }
)

const Components = {
  ProductCard,
  ...ProductShelfCustomizations.components,
}

export { Components, productShelfPropsCustomization as Props }
