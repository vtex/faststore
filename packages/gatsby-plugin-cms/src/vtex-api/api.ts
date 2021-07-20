import type { Options } from '../gatsby-node'

const baseCommerce = ({
  tenant,
  environment = 'vtexcommercestable',
}: Options) => `https://${tenant}.${environment}.com.br`

const baseIO = ({ tenant, workspace = 'master' }: Options) =>
  `https://${workspace}--${tenant}.myvtex.com`

export const api = (options: Options) => ({
  graphql: `${baseIO(options)}/graphql`,
  catalog: {
    brand: {
      id: (id: number | string) =>
        `${baseCommerce(options)}/api/catalog_system/pub/brand/${id}`,
    },
    category: {
      id: (id: number | string) =>
        `${baseCommerce(options)}/api/catalog_system/pub/category/${id}`,
    },
  },
})
