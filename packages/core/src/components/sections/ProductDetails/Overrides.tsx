import {
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
  BuyButton as UIBuyButton,
  SkuSelector as UISkuSelector,
  ShippingSimulation as UIShippingSimulation,
} from '@faststore/ui'

import ProductDetailsCustomizations from 'src/customizations/components/overrides/ProductDetails'

const Components = {
  ProductTitle: UIProductTitle,
  DiscountBadge: UIDiscountBadge,
  BuyButton: UIBuyButton,
  SkuSelector: UISkuSelector,
  ShippingSimulation: UIShippingSimulation,
  ...ProductDetailsCustomizations.components,
}

export { Components }
