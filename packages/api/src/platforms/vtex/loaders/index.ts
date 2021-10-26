import { getSimulationLoader } from './simulation'
import { getSkuLoader } from './sku'
import type { Options } from '..'
import type { Clients } from '../clients'

export type Loaders = ReturnType<typeof getLoaders>

export const getLoaders = (options: Options, clients: Clients) => {
  const skuLoader = getSkuLoader(options, clients)
  const simulationLoader = getSimulationLoader(options, clients)

  return {
    skuLoader,
    simulationLoader,
  }
}
