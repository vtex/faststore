import {
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
  BuyButton as UIBuyButton,
} from '@faststore/ui'

import ShippingSimulation from 'src/components/ui/ShippingSimulation'

import ProductDetailsCustomizations from 'src/customizations/components/overrides/ProductDetails'

const Components = {
  UIProductTitle,
  UIDiscountBadge,
  UIBuyButton,
  ShippingSimulation,
  ...ProductDetailsCustomizations.components,
}

export { Components }
