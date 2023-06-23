import {
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
  BuyButton as UIBuyButton,
  SkuSelector as UISkuSelector,
  ShippingSimulation as UIShippingSimulation,
  Icon as UIIcon,
  Price as UIPrice,
  QuantitySelector as UIQuantitySelector,
  ImageZoom as UIImageZoom,
  ImageGallery as UIImageGallery,
} from '@faststore/ui'
import ImageGallery from 'src/components/ui/ImageGallery'
import ShippingSimulation from 'src/components/ui/ShippingSimulation/ShippingSimulation'
import { Image } from 'src/components/ui/Image'

import ProductDetailsCustomizations from 'src/customizations/components/overrides/ProductDetails'

const productDetailsComponentsCustomization = {}

const productDetailsPropsCustomization = {} as any

Object.entries(ProductDetailsCustomizations.components).forEach(
  ([key, value]) => {
    if (value.Component) {
      productDetailsComponentsCustomization[key] = value.Component
    }
  }
)

Object.entries(ProductDetailsCustomizations.components).forEach(
  ([key, value]) => {
    if (value.props) {
      productDetailsPropsCustomization[key] = value.props
    }
  }
)

const Components = {
  ProductTitle: UIProductTitle,
  DiscountBadge: UIDiscountBadge,
  BuyButton: UIBuyButton,
  Icon: UIIcon,
  Price: UIPrice,
  QuantitySelector: UIQuantitySelector,
  SkuSelector: UISkuSelector,
  ShippingSimulation: UIShippingSimulation,
  ImageGallery: UIImageGallery,
  ImageZoom: UIImageZoom,
  __experimentalImageGalleryImage: Image,
  __experimentalImageGallery: ImageGallery,
  __experimentalShippingSimulation: ShippingSimulation,
  ...productDetailsComponentsCustomization,
}

export { Components, productDetailsPropsCustomization as Props }
