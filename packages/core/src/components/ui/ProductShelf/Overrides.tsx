import ProductCard from 'src/components/product/ProductCard'

import ProductShelfCustomizations from 'src/customizations/components/overrides/ProductShelf'

const Components = {
  ProductCard,
  ...ProductShelfCustomizations.components,
}

export { Components }
