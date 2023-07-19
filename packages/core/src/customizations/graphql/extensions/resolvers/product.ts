// TODO we should export all the Root Objects so that we can leverage typescript here
import type { StoreProductRoot } from '@faststore/api'

const productResolver = {
  StoreProduct: {
    customData: (root: StoreProductRoot) => {
      return 'My item id: ' + root.itemId
    },
  },
}

export default productResolver
