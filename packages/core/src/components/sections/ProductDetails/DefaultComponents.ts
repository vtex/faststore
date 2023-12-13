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

export const ProductDetailsDefaultComponents = {
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
}
