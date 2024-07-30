import {
  BuyButton as UIBuyButton,
  DiscountBadge as UIDiscountBadge,
  Icon as UIIcon,
  ImageGallery as UIImageGallery,
  ImageGalleryViewer as UIImageGalleryViewer,
  ProductPrice as UIProductPrice,
  ProductTitle as UIProductTitle,
  QuantitySelector as UIQuantitySelector,
  ShippingSimulation as UIShippingSimulation,
  SkuSelector as UISkuSelector,
} from '@faststore/ui'

import { Image } from 'app/components/ui/Image'
import LocalImageGallery from 'src/components/ui/ImageGallery'
import LocalNotAvailableButton from 'src/components/product/NotAvailableButton'
import LocalProductDescription from 'src/components/ui/ProductDescription'
import { ProductDetailsSettings as LocalProductDetailsSettings } from 'src/components/ui/ProductDetails'
import LocalShippingSimulation from 'src/components/ui/ShippingSimulation/ShippingSimulation'

export const ProductDetailsDefaultComponents = {
  ProductTitle: UIProductTitle,
  DiscountBadge: UIDiscountBadge,
  BuyButton: UIBuyButton,
  Icon: UIIcon,
  ProductPrice: UIProductPrice,
  QuantitySelector: UIQuantitySelector,
  SkuSelector: UISkuSelector,
  ShippingSimulation: UIShippingSimulation,
  ImageGallery: UIImageGallery,
  ImageGalleryViewer: UIImageGalleryViewer,
  __experimentalImageGalleryImage: Image,
  __experimentalImageGallery: LocalImageGallery,
  __experimentalShippingSimulation: LocalShippingSimulation,
  __experimentalNotAvailableButton: LocalNotAvailableButton,
  __experimentalProductDescription: LocalProductDescription,
  __experimentalProductDetailsSettings: LocalProductDetailsSettings,
}
