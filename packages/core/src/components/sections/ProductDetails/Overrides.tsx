import {
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
  BuyButton as UIBuyButton,
  SkuSelector as UISkuSelector,
  ShippingSimulation as UIShippingSimulation,
  Icon as UIIcon,
  Price as UIPrice,
  QuantitySelector as UIQuantitySelector,
  ImageGalleryViewer as UIImageGalleryViewer,
  ImageGallery as UIImageGallery,
} from '@faststore/ui'

import LocalImageGallery from 'src/components/ui/ImageGallery'
import LocalShippingSimulation from 'src/components/ui/ShippingSimulation/ShippingSimulation'
import { Image } from 'src/components/ui/Image'

import { getSectionOverrides } from 'src/utils/overrides'
import { override } from 'src/customizations/components/overrides/ProductDetails'
import type { ProductDetailsOverrideDefinition } from 'src/typings/overrides'

const {
  ProductTitle,
  DiscountBadge,
  BuyButton,
  Icon,
  Price,
  QuantitySelector,
  SkuSelector,
  ShippingSimulation,
  ImageGallery,
  ImageGalleryViewer,
  __experimentalImageGalleryImage,
  __experimentalImageGallery,
  __experimentalShippingSimulation,
} = getSectionOverrides(
  {
    ProductTitle: UIProductTitle,
    DiscountBadge: UIDiscountBadge,
    BuyButton: UIBuyButton,
    Icon: UIIcon,
    Price: UIPrice,
    QuantitySelector: UIQuantitySelector,
    SkuSelector: UISkuSelector,
    ShippingSimulation: UIShippingSimulation,
    ImageGallery: UIImageGallery,
    ImageGalleryViewer: UIImageGalleryViewer,
    __experimentalImageGalleryImage: Image,
    __experimentalImageGallery: LocalImageGallery,
    __experimentalShippingSimulation: LocalShippingSimulation,
  },
  override as ProductDetailsOverrideDefinition
)

export {
  ProductTitle,
  DiscountBadge,
  BuyButton,
  Icon,
  Price,
  QuantitySelector,
  SkuSelector,
  ShippingSimulation,
  ImageGallery,
  ImageGalleryViewer,
  __experimentalImageGalleryImage,
  __experimentalImageGallery,
  __experimentalShippingSimulation,
}
