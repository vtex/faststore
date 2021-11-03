import { getSimulationLoader } from './simulation'
import { getSkuLoader } from './sku'
import type { Context, Options } from '..'

export type Loaders = ReturnType<typeof getLoaders>

export const getLoaders = (options: Options, { clients }: Context) => {
  const skuLoader = getSkuLoader(options, clients)
  const simulationLoader = getSimulationLoader(options, clients)

  return {
    skuLoader,
    simulationLoader,
  }
}
