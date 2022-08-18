import DataLoader from 'dataloader'
import pLimit from 'p-limit'

import type { Options } from '..'
import type { Clients } from '../clients'
import type {
  ShippingItem,
  Simulation,
  SimulationArgs,
} from '../clients/commerce/types/Simulation'

// Limits concurrent requests to the API per request cycle
const CONCURRENT_REQUESTS_MAX = 1

export const getSimulationLoader = (_: Options, clients: Clients) => {
  const limit = pLimit(CONCURRENT_REQUESTS_MAX)

  const loader = async (simulationArgs: readonly SimulationArgs[]) => {
    const allItems = simulationArgs.reduce((acc, { items }: SimulationArgs) => {
      return [...acc, items]
    }, [] as ShippingItem[][])

    const items = [...allItems.flat()]
    const simulation = await clients.commerce.checkout.simulation({
      country: simulationArgs[0].country,
      postalCode: simulationArgs[0].postalCode,
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

  const limited = async (allItems: readonly SimulationArgs[]) =>
    limit(loader, allItems)

  return new DataLoader<SimulationArgs, Simulation>(limited, {
    maxBatchSize: 50,
  })
}
