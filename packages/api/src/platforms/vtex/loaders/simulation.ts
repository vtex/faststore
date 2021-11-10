import DataLoader from 'dataloader'

import type {
  PayloadItem,
  Simulation,
} from '../clients/commerce/types/Simulation'
import type { Options } from '..'
import type { Clients } from '../clients'

export const getSimulationLoader = (_: Options, clients: Clients) => {
  const loader = async (allItems: readonly PayloadItem[][]) => {
    const items = [...allItems.flat()]
    const simulation = await clients.commerce.checkout.simulation({
      items,
    })

    // Sort and filter simulation since Checkout API may return
    // items that we didn't ask for
    const simulated = simulation.items.reduce((acc, item) => {
      const index = item.requestIndex

      if (typeof index === 'number' && index < acc.length) {
        acc[index] = item
      }

      return acc
    }, Array(items.length).fill(null) as Simulation['items'])

    const itemsIndices = allItems.reduce(
      (acc, curr) => [...acc, curr.length + acc[acc.length - 1]],
      [0]
    )

    return allItems.map((__, index) => ({
      ...simulation,
      items: simulated
        .slice(itemsIndices[index], itemsIndices[index + 1])
        .filter((item) => Boolean(item)),
    }))
  }

  return new DataLoader<PayloadItem[], Simulation>(loader, {
    maxBatchSize: 20,
  })
}
