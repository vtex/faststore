import { join } from 'path'
import { promisify } from 'util'

import {
  ensureDir,
  outputFile,
  readdir as readDirCB,
  readJSON,
  stat as statCB,
  Stats,
  pathExists,
} from 'fs-extra'
import { CreatePagesArgs } from 'gatsby'

import { getMeta, isContent } from './common'
import { ContentDOM } from './builder/compiler'

const root = process.cwd()

const readDir = promisify<string, string[]>(readDirCB)
const stat = promisify<string, Stats>(statCB)

export const createPages = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const blocksRootPath = join(root, '@vtex/gatsby-plugin-cms/templates')

  const exists = await pathExists(blocksRootPath)

  if (!exists) {
    return
  }

  const entries = await readDir(blocksRootPath)
  const stats = await Promise.all(
    entries.map((p) => stat(join(blocksRootPath, p)))
  )

  const files = entries.filter(
    (filename, index) => stats[index].isFile() && filename.endsWith('.json')
  )

  // ensure dist folder
  const generatedRootPath = join(blocksRootPath, '/__generated__')

  await ensureDir(generatedRootPath)

  // Transform file contents
  const nodes = await Promise.all(
    files.map(async (filename) => {
      const filepath = join(
        generatedRootPath,
        filename.replace('.json', '.tsx')
      )

      const content = await readJSON(join(blocksRootPath, filename))

      if (!isContent(content)) {
        throw new Error(`${filename} is not a CMS compatible block`)
      }

      const dom = new ContentDOM(content)
      const src = dom.renderToString()
      const slug = getMeta(content.extraBlocks)?.slug

      if (typeof slug !== 'string') {
        throw new Error(`No slug found for CMS block ${filename}`)
      }

      return {
        filepath,
        slug,
        src,
      }
    })
  )

  // // Create page .tsx files as well as gatsby's node pages
  await Promise.all(
    nodes.map(async ({ src, slug, filepath }) => {
      await outputFile(filepath, src)

      createPage({
        path: slug,
        component: filepath,
        context: {},
      })
    })
  )
}
