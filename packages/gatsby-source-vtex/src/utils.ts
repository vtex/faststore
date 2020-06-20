import axios from 'axios'
import { PluginOptions } from 'gatsby'

interface ApiUrl {
  tenant: unknown
  environment: unknown
  sufix: string
}

const getApiUrl = ({ tenant, environment, sufix }: ApiUrl): string =>
  `https://${tenant}.${environment}.com.br/api/catalog_system/pub/${sufix}`

export const getCatalogSystem = <T>(sufix: string) => async ({
  tenant,
  environment,
}: PluginOptions): Promise<T[]> => {
  const url = getApiUrl({ tenant, environment, sufix })
  const { data } = await axios.get(url)
  return data
}
