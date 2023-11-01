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
import LocalNotAvailableButton from 'src/components/product/NotAvailableButton'

import { getSectionOverrides } from 'src/sdk/overrides/overrides'
import { override } from 'src/customizations/src/components/overrides/ProductDetails'
import type { SectionOverrideDefinition } from 'src/typings/overridesDefinition'

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
  __experimentalNotAvailableButton,
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
    __experimentalNotAvailableButton: LocalNotAvailableButton,
  },
  override as SectionOverrideDefinition<'ProductDetails'>
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
  __experimentalNotAvailableButton,
}
