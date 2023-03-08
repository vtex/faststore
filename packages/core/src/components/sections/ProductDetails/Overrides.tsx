import { Price as DefaultPrice } from '@faststore/ui'

import ProductDetailsCustomizations from 'src/customizations/components/overrides/ProductDetails'

const Components = {
    DefaultPrice,
    ...ProductDetailsCustomizations.components
}

export { Components }