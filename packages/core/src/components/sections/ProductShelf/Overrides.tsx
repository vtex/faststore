import { ProductShelf as UIProductShelf } from '@faststore/ui'
import ProductCard from 'src/components/product/ProductCard'

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
  ProductShelf: UIProductShelf,
  __experimentalProductCard: ProductCard,
  ...productShelfComponentsCustomization,
}

export { Components, productShelfPropsCustomization as Props }
