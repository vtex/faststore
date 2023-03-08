import { Price } from '@faststore/ui'

import ProductDetailsCustomizations from 'src/customizations/components/overrides/ProductDetails'

const Components = {
    Price,
    ...ProductDetailsCustomizations.components
}

export { Components }
