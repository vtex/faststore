import { promisify } from 'util'
import { join } from 'path'
import { readFile } from 'fs'

import slugify from 'slugify'

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

  return paths
}

export default staticPaths
