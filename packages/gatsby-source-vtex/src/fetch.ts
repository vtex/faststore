import axios from 'axios'
import { PluginOptions } from 'gatsby'

interface Product {
  linkText: string
  productId: string
}

export const ProductSearch = async (
  { accountName, environment, appToken, appKey }: PluginOptions,
  search = ''
): Promise<Product[]> => {
  try {
    const { data } = await axios.get(
      `https://${accountName}.${environment}.com.br/api/catalog_system/pub/products/search/${search}`,
      {
        headers: {
          'x-vtex-api-appkey': appKey,
          'x-vtex-api-appToken': appToken,
        },
      }
    )

    return data
  } catch (error) {
    throw error
  }
}
