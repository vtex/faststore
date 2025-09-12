import {
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
  BuyButton as UIBuyButton,
  SkuSelector as UISkuSelector,
  ShippingSimulation as UIShippingSimulation,
  Icon as UIIcon,
  ProductPrice as UIProductPrice,
  QuantitySelector as UIQuantitySelector,
  ImageGalleryViewer as UIImageGalleryViewer,
  ImageGallery as UIImageGallery,
  SKUMatrix as UISKUMatrix,
  SKUMatrixSidebar as UISKUMatrixSidebar,
  SKUMatrixTrigger as UISKUMatrixTrigger,
} from '@vtex/faststore-ui'

import LocalImageGallery from '../../ui/ImageGallery'
import LocalShippingSimulation from '../../ui/ShippingSimulation/ShippingSimulation'
import { Image } from '../../ui/Image'
import LocalNotAvailableButton from '../../product/NotAvailableButton'
import LocalSKUMatrixSidebar from '../../ui/SKUMatrix/SKUMatrixSidebar'
import LocalProductDescription from '../../ui/ProductDescription/ProductDescription'
import { ProductDetailsSettings as LocalProductDetailsSettings } from '../../ui/ProductDetails'

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
  SKUMatrix: UISKUMatrix,
  SKUMatrixTrigger: UISKUMatrixTrigger,
  SKUMatrixSidebar: UISKUMatrixSidebar,
  __experimentalImageGalleryImage: Image,
  __experimentalImageGallery: LocalImageGallery,
  __experimentalShippingSimulation: LocalShippingSimulation,
  __experimentalSKUMatrixSidebar: LocalSKUMatrixSidebar,
  __experimentalNotAvailableButton: LocalNotAvailableButton,
  __experimentalProductDescription: LocalProductDescription,
  __experimentalProductDetailsSettings: LocalProductDetailsSettings,
}
