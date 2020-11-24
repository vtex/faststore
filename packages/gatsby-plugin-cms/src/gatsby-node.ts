import { join } from 'path'
import { promisify } from 'util'

import {
  ensureDir,
  outputFile,
  readdir as readDirCB,
  readJSON,
  stat as statCB,
  Stats,
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
  try {
    const blocksPath = join(root, 'src/cms')
    const entries = await readDir(blocksPath)
    const stats = await Promise.all(
      entries.map((p) => stat(join(blocksPath, p)))
    )

    const files = entries.filter((_, index) => stats[index].isFile())

    // ensure dist folder
    const cmsRoot = join(root, '.cache/vtex-cms')

    await ensureDir(cmsRoot)

    // Transform file contents
    const nodes = await Promise.all(
      files.map(async (filename) => {
        const filepath = join(cmsRoot, filename.replace('.json', '.tsx'))
        const content = await readJSON(join(blocksPath, filename))

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
  } catch (err) {
    console.error(err)
  }
}
