import type { StoreProductRoot } from '@faststore/api'

const productResolver = {
  StoreProduct: {
    customData: (root: StoreProductRoot) => {
      return 'My item id: ' + root.itemId
    },
  },
}

export default productResolver
