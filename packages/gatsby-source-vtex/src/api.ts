import axios from 'axios'
import { PluginOptions } from 'gatsby'

type SufixVoid = (options: PluginOptions) => string
type Sufix = string | SufixVoid

const axiosOptions = {
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
}

export const getVtex = <T>(sufix: Sufix) => async (
  options: PluginOptions
): Promise<T[]> => {
  const sufixStr = typeof sufix === 'string' ? sufix : sufix(options)
  const url = `https://${options.tenant}.${options.environment}.com.br/api/catalog_system/pub/${sufixStr}`
  const { data } = await axios.get(url, axiosOptions)
  return data
}
