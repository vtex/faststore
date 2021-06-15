import { promisify } from 'util'
import { join } from 'path'
import { readFile } from 'fs'

import slugify from 'slugify'
import pMap from 'p-map'

import { api } from './api'
import { fetchIS, fetchVTEX } from './fetch'
import type { Brand, Category } from './types'

interface Options {
  tenant: string
  workspace?: string
  environment?: 'vtexcommercestable' | 'vtexcommercebeta'
  maxNumPaths?: number // max number of staticPaths to generate
}

interface SearchResult {
  products: Array<{ url: string }>
  pagination: {
    count: number
  }
}

const readFileAsync = promisify(readFile)

const dfs = (root: Category, paths: string[]) => {
  const url = new URL(root.url)

  paths.push(url.pathname.toLowerCase())

  for (const child of root.children) {
    dfs(child, paths)
  }
}

const staticPathsFromJson = async () => {
  const path = join(process.cwd(), 'staticPaths.json')
  const staticPaths = await readFileAsync(path, { encoding: 'utf-8' })

  return JSON.parse(staticPaths)
}

const staticPaths = async ({
  tenant,
  workspace = 'master',
  environment = 'vtexcommercestable',
  maxNumPaths = 100,
}: Options): Promise<string[]> => {
  const paths: string[] = await staticPathsFromJson() // final array containing all paths

  if (process.env.NODE_ENV === 'development') {
    return paths
  }

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

  // TODO: decrease the number of items per page and increase the number of
  // pages to have faster requests

  const brands = await fetchVTEX<Brand[]>(
    api.catalog.brand.list({ page: 0, pageSize: 1000 }),
    options
  )

  for (const brand of brands) {
    if (!brand.isActive) {
      continue
    }

    paths.push(
      `/${slugify(brand.name, { replacement: '-', lower: true, strict: true })}`
    )
  }

  // Add product paths into the final array

  // This generates at least `itemsPerPage` and at most 2500 product paths
  // `itemsPerPage` is an arbritary number, however 2500 is hard coded in VTEX search
  const itemsPerPage = 100
  const totalItems = Math.min(
    2500,
    Math.max(itemsPerPage, maxNumPaths - paths.length)
  )

  const pages = new Array(Math.ceil(totalItems / itemsPerPage)).fill(null)

  const productUrls = await pMap(
    pages,
    (_, page) =>
      fetchIS<SearchResult>(
        api.is.search({
          'hide-unavailable-items': false,
          sort: 'orders:desc',
          count: itemsPerPage,
          operator: 'and',
          page: page + 1,
        }),
        options
      ).then(({ products }) => products.map((x) => x.url)),
    { concurrency: 10 }
  ).then((x) => x.flat())

  return [...paths, ...productUrls]
}

export default staticPaths
