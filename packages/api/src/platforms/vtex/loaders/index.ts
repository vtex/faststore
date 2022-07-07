import { getSalesChannelLoader } from './salesChannel';
import { getSimulationLoader } from './simulation'
import { getSkuLoader } from './sku'
import { getCollectionLoader } from './collection'
import type { Context, Options } from '..'

export type Loaders = ReturnType<typeof getLoaders>

export const getLoaders = (options: Options, { clients }: Context) => {
  const skuLoader = getSkuLoader(options, clients)
  const simulationLoader = getSimulationLoader(options, clients)
  const collectionLoader = getCollectionLoader(options, clients)
  const salesChannelLoader = getSalesChannelLoader(options, clients)

  return {
    skuLoader,
    simulationLoader,
    collectionLoader,
    salesChannelLoader
  }
}
