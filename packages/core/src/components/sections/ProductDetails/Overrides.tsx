import {
  ProductTitle as UIProductTitle,
  DiscountBadge as UIDiscountBadge,
  BuyButton as UIBuyButton,
} from '@faststore/ui'

import ProductDetailsCustomizations from 'src/customizations/components/overrides/ProductDetails'

const Components = {
  UIProductTitle,
  UIDiscountBadge,
  UIBuyButton,
  ...ProductDetailsCustomizations.components,
}

export { Components }
