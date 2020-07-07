import './setup'

import { GatsbyNode, PluginOptions, SourceNodesArgs } from 'gatsby'

import { api } from './api'
import { fetchVTEX, VTEXOptions } from './fetch'
import { Category, Product, Tenant } from './types'
import {
  createBindingNode,
  createCategoryNode,
  createProductNode,
} from './utils'

type Options = PluginOptions & VTEXOptions

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  args: SourceNodesArgs,
  options: Options
) => {
  const { tenant } = options

  // VTEX Context
  const { bindings } = await fetchVTEX<Tenant>(
    api.tenants.tenant(tenant),
    options
  )
  bindings.forEach((binding) => createBindingNode(args, binding))

  // PRODUCT
  const productData = await fetchVTEX<Product[]>(
    api.search({ from: 0, to: 9 }),
    options
  )
  productData.forEach((product) => createProductNode(args, product))

  // CATEGORY
  const categoryData = await fetchVTEX<Category[]>(
    api.catalog.category.tree(1),
    options
  )
  categoryData
    .filter((category) => !category.name.includes('[Inactive]'))
    .forEach((category) => createCategoryNode(args, category))
}
