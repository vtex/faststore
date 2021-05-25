import { promisify } from 'util'
import { join } from 'path'
import { readFile } from 'fs'

import slugify from 'slugify'
import pMap from 'p-map'

import { api } from './api'
import { fetchVTEX } from './fetch'
import type { Brand, Category } from './types'

interface Options {
  tenant: string
  workspace?: string
  environment?: 'vtexcommercestable' | 'vtexcommercebeta'
  maxNumPaths?: number // max number of staticPaths to generate
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
  const itemsPerPage = 25
  const pagination = new Array(
    Math.ceil(
      Math.min(2500, Math.max(itemsPerPage, maxNumPaths - paths.length)) /
        itemsPerPage
    )
  )

  const products = await pMap(
    pagination,
    (_, pageIndex) =>
      fetchVTEX<Array<{ linkText?: string }>>(
        api.catalog.category.search({
          sort: 'OrderByTopSaleDESC',
          from: pageIndex ? pageIndex * itemsPerPage + 1 : pageIndex,
          to: pageIndex
            ? pageIndex * itemsPerPage + itemsPerPage
            : itemsPerPage,
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
