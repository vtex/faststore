import { Price, DiscountBadge } from '@faststore/ui'

import ProductDetailsCustomizations from 'src/customizations/components/overrides/ProductDetails'

const Components = {
    Price,
    DiscountBadge,
    ...ProductDetailsCustomizations.components
}

export { Components }
