import { api } from './api'
import { fetchVTEX } from './fetch'
import type { Category } from './types'

interface Options {
  tenant: string
  workspace?: string
  environment?: 'vtexcommercestable' | 'vtexcommercebeta'
  pages?: number // max number of staticPaths to generate
}

const dfs = (root: Category, paths: string[]) => {
  const url = new URL(root.url)

  paths.push(url.pathname.toLowerCase())

  for (const child of root.children) {
    dfs(child, paths)
  }
}

const staticPaths = async ({
  tenant,
  workspace = 'master',
  environment = 'vtexcommercestable',
  pages = 500,
}: Options): Promise<string[]> => {
  const options = {
    tenant,
    workspace,
    environment,
  }

  const tree = await fetchVTEX<Category[]>(
    api.catalog.category.tree(4),
    options
  )

  const paths: string[] = []

  for (const node of tree) {
    dfs(node, paths)
  }

  const products = await fetchVTEX<Array<{ linkText: string }>>(
    api.catalog.category.search({
      from: 0,
      to: Math.max(10, pages - paths.length), // at least 10 products
    }),
    options
  )

  for (const { linkText } of products) {
    paths.push(`/${linkText}/p`)
  }

  return paths
}

export default staticPaths
