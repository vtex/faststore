import { join } from 'path'

import chokidar from 'chokidar'
import { ensureDir, outputFileSync, readJSONSync, unlink } from 'fs-extra'
import { CreatePagesArgs } from 'gatsby'

import { ContentDOM } from './builder/compiler'
import { getMeta, isContent } from './common'

const root = process.cwd()

export const createPages = async ({
  actions: { createPage },
  reporter,
}: CreatePagesArgs) => {
  const blocksRootPath = join(root, 'src/@vtex/gatsby-plugin-cms/templates')

  // ensure dist folder
  const generatedRootPath = join(blocksRootPath, '/__generated__')

  await ensureDir(generatedRootPath)

  const watcher = chokidar.watch('*.json', {
    persistent: true,

    ignored: '*.tsx',
    ignoreInitial: false,
    followSymlinks: false,
    cwd: blocksRootPath,

    depth: 1,
  })

  const getOutpath = (filename: string) =>
    join(generatedRootPath, filename.replace('.json', '.tsx'))

  const transformFile = (filename: string) => {
    const inpath = join(blocksRootPath, filename)
    const outpath = getOutpath(filename)

    const content = readJSONSync(inpath)

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
      src,
      slug,
      outpath,
    }
  }

  watcher.on('add', (filename: string) => {
    const { slug, outpath, src } = transformFile(filename)

    outputFileSync(outpath, src)

    createPage({
      path: slug,
      component: outpath,
      context: {},
    })
  })

  watcher.on('change', (filename: string) => {
    const { outpath, src } = transformFile(filename)

    outputFileSync(outpath, src)
  })

  watcher.on('unlink', async (filename: string) => {
    const outpath = getOutpath(filename)

    await unlink(outpath)
  })

  // Wait for chokidar to be ready
  const ready = new Promise((resolve) => watcher.on('ready', resolve))

  await ready
}
