import type { GraphqlContext } from '..'
import { getCollectionLoader } from './collection'
import { getSalesChannelLoader } from './salesChannel'
import { getSimulationLoader } from './simulation'
import { getSkuLoader } from './sku'

export type Loaders = ReturnType<typeof getLoaders>

export const getLoaders = (options: Options, ctx: GraphqlContext) => {
  const { clients } = ctx
  const skuLoader = getSkuLoader(options, clients)
  const simulationLoader = getSimulationLoader(options, clients)
  const collectionLoader = getCollectionLoader(options, clients, ctx)
  const salesChannelLoader = getSalesChannelLoader(options, clients)

  return {
    skuLoader,
    simulationLoader,
    collectionLoader,
    salesChannelLoader,
  }
}
