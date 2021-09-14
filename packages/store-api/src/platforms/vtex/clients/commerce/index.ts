import { fetchAPI } from '../common'
import type {
  Simulation,
  SimulationArgs,
  SimulationOptions,
} from './types/Checkout'
import type { CategoryTree } from './types/CategoryTree'
import type { Options } from '../..'
import type { Brand } from './types/Brand'

const getBase = ({ account, environment }: Options) =>
  `http://${account}.${environment}.com.br`

export const VtexCommerce = (opts: Options) => {
  const base = getBase(opts)

  return {
    catalog: {
      brand: {
        list: (): Promise<Brand[]> =>
          fetchAPI(`${base}/api/catalog_system/pub/brand/list`),
      },
      category: {
        tree: (depth = 3): Promise<CategoryTree[]> =>
          fetchAPI(`${base}/api/catalog_system/pub/category/tree/${depth}`),
      },
    },
    checkout: {
      simulation: (
        args: SimulationArgs,
        options: SimulationOptions = { sc: '1' }
      ): Promise<Simulation> => {
        const params = new URLSearchParams({ ...options })

        return fetchAPI(
          `${base}/api/checkout/pub/orderForms/simulation?${params.toString()}`,
          {
            method: 'POST',
            body: JSON.stringify(args),
            headers: {
              'content-type': 'application/json',
            },
          }
        )
      },
    },
  }
}
