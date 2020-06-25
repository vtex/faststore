import axios from 'axios'
import { PluginOptions, SourceNodesArgs } from 'gatsby'

import { Product, Category } from './types'

interface ApiUrl {
  tenant: unknown
  environment: unknown
  sufix: string
}

type SufixVoid = (options: PluginOptions) => string
type Sufix = string | SufixVoid

const getApiUrl = ({ tenant, environment, sufix }: ApiUrl): string =>
  `https://${tenant}.${environment}.com.br/api/catalog_system/pub/${sufix}`

export const getCatalogSystem = <T>(sufix: Sufix) => async (
  options: PluginOptions
): Promise<T[]> => {
  const url = getApiUrl({
    tenant: options.tenant,
    environment: options.environment,
    sufix: typeof sufix === 'string' ? sufix : sufix(options),
  })
  const { data } = await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
  })
  return data
}

export const createProductNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  product: Product
) => {
  const NODE_TYPE = 'Product'
  const data = {
    ...product,
    slug: `/${product.linkText}/p`,
    categoryId: Number(product.categoryId),
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.productId}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}

export const createCategoryNode = (
  {
    actions: { createNode },
    createNodeId,
    createContentDigest,
  }: SourceNodesArgs,
  { id, children, ...category }: Category
) => {
  const NODE_TYPE = 'Category'
  const urlSplited = category.url.split('/')
  const slug = urlSplited[urlSplited.length - 1]
  const data = {
    ...category,
    slug,
    categoryId: Number(id),
  }

  createNode({
    ...data,
    id: createNodeId(`${NODE_TYPE}-${data.categoryId}`),
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(data),
      contentDigest: createContentDigest(data),
    },
  })
}
