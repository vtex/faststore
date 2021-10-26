import DataLoader from 'dataloader'

import type {
  PayloadItem,
  Simulation,
} from '../clients/commerce/types/Simulation'
import type { Options } from '..'
import type { Clients } from '../clients'

export const getSimulationLoader = (_: Options, clients: Clients) => {
  const loader = async (items: readonly PayloadItem[][]) => {
    const simulated = await clients.commerce.checkout.simulation({
      items: [...items.flat()],
    })

    const itemsIndices = items.reduce(
      (acc, curr) => [...acc, curr.length + acc[acc.length - 1]],
      [0]
    )

    if (simulated.items.length !== itemsIndices[itemsIndices.length - 1]) {
      const askedItems = itemsIndices[itemsIndices.length - 1]
      const returnedItems = simulated.items.length

      throw new Error(
        `Simulation asked for ${askedItems}, but received ${returnedItems} items`
      )
    }

    return items.map((__, index) => ({
      ...simulated,
      items: simulated.items.slice(
        itemsIndices[index],
        itemsIndices[index + 1]
      ),
    }))
  }

  return new DataLoader<PayloadItem[], Simulation>(loader, {
    maxBatchSize: 20,
  })
}
