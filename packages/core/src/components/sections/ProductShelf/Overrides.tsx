import DefaultProductCard from 'src/components/product/ProductCard'

import ProductShelfCustomizations from 'src/customizations/components/overrides/ProductShelf'

const Components = {
    DefaultProductCard,
    ...ProductShelfCustomizations.components
}

export { Components }