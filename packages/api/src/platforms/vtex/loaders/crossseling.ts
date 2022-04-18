import DataLoader from 'dataloader'

// import { NotFoundError } from '../utils/errors'
import type {
  CrossSellingItem,
  WhoSawAlsoBoughtProducts,
} from '../clients/commerce/types/CrossSelling'
import type { Options } from '..'
import type { Clients } from '../clients'

export const getCrossSellingLoader = (_: Options, clients: Clients) => {
  const loader = async (
    data: readonly CrossSellingItem[]
  ): Promise<WhoSawAlsoBoughtProducts[]> => {
    const products = await clients.commerce.catalog.crossseling.whoSawAlsoBought(
      data[0].productId
    )

    // console.log(`deu certo`, products)

    if (!products) {
      return []
    }

    return [
      {
        productID: '1',
      },
    ]
  }

  return new DataLoader<CrossSellingItem, WhoSawAlsoBoughtProducts>(loader, {
    // DataLoader is being used to cache requests, not to batch them
    batch: false,
  })
}
