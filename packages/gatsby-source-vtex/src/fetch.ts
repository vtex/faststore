import axios from 'axios'
import { PluginOptions } from 'gatsby'

interface Product {
  linkText: string
  productId: string
}

export const ProductSearch = async (
  { tenant, environment }: PluginOptions,
  search = ''
): Promise<Product[]> => {
  try {
    const { data } = await axios.get(
      `https://${tenant}.${environment}.com.br/api/catalog_system/pub/products/search/${search}`
    )

    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
