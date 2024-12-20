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
} from '@faststore/ui'

import LocalImageGallery from 'src/components/ui/ImageGallery'
import LocalShippingSimulation from 'src/components/ui/ShippingSimulation/ShippingSimulation'
import { Image } from 'src/components/ui/Image'
import LocalNotAvailableButton from 'src/components/product/NotAvailableButton'
import LocalSKUMatrixSidebar from 'src/components/ui/SKUMatrix/SKUMatrixSidebar'
import LocalProductDescription from 'src/components/ui/ProductDescription/ProductDescription'
import { ProductDetailsSettings as LocalProductDetailsSettings } from 'src/components/ui/ProductDetails'

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
