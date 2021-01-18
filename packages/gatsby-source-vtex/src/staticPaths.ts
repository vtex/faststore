import pMap from 'p-map'

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
  pages = 100,
}: Options): Promise<string[]> => {
  const paths: string[] = [] // final array containing all paths

  const options = {
    tenant,
    workspace,
    environment,
  }

  // Add all category related paths.

  const tree = await fetchVTEX<Category[]>(
    api.catalog.category.tree(4),
    options
  )

  for (const node of tree) {
    dfs(node, paths)
  }

  // Add product paths into the final array

  // This generates at least `itemsPerPage` and at most 2500 product paths
  // `itemsPerPage` is an arbritary number, however 2500 is hard coded in VTEX search
  const itemsPerPage = 49
  const pagination = new Array(
    Math.ceil(
      Math.min(2500, Math.max(itemsPerPage, pages - paths.length)) /
        itemsPerPage
    )
  )

  const products = await pMap(
    pagination,
    (_, pageIndex) =>
      fetchVTEX<Array<{ linkText?: string }>>(
        api.catalog.category.search({
          from: pageIndex * itemsPerPage,
          to: pageIndex * itemsPerPage + itemsPerPage,
        }),
        options
      ),
    {
      concurrency: 5,
    }
  ).then((p) => p.flat())

  for (const { linkText } of products) {
    if (!linkText) {
      throw new Error(
        `[gatsby-source-vtex]: Something went wrong while generating staticPaths. Expected a product path, but got ${linkText}`
      )
    }

    paths.push(`/${linkText}/p`)
  }

  return paths
}

export default staticPaths
