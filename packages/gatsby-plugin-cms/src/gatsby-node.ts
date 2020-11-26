import { join } from 'path'

import { JSONSchema6 } from 'json-schema'
import chokidar from 'chokidar'
import {
  ensureDir,
  outputFileSync,
  pathExists,
  readJSONSync,
  unlink,
  outputJSON,
} from 'fs-extra'
import { CreatePagesArgs } from 'gatsby'

import { ContentDOM } from './builder/compiler'
import { getMeta, isContent } from './common'
import { Components, ContentTypes, Schemas } from './index'

interface CMSContentType {
  previewUrl: string
  messages: Record<string, string>
  blocks: Array<{ name: string; schema: JSONSchema6 }>
  beforeBlocks: Array<{ name: string; schema: JSONSchema6 }>
  afterBlocks: Array<{ name: string; schema: JSONSchema6 }>
  extraBlocks: Array<{
    name: string
    blocks: Array<{ name: string; schema: JSONSchema6 }>
  }>
}

const { name } = require('./package.json')

const root = process.cwd()

export const onPostBootstrap = async () => {
  // Read index.ts from shadowed plugin
  const filepath = join(root, 'src', name, 'index.ts')
  const exists = await pathExists(filepath)

  if (!exists) {
    return
  }

  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const { components, schemas, contentTypes } = require(filepath) as {
    components: Components
    schemas: Schemas
    contentTypes: ContentTypes
  }

  // Make sure all components have a schema
  for (const component in components) {
    if (!(component in schemas)) {
      throw new Error(
        `${component} does not have a schema. Please define it and export in schemas at index.ts`
      )
    }
  }

  // Transform all contentTypes into CMS ready contentType json
  const contentTypesCMS = Object.keys(contentTypes).reduce((acc, key) => {
    const ct = contentTypes[key]

    const blocks = Object.keys(ct.blocks).map((k) => ({
      name: k,
      schema: ct.blocks[k],
    }))

    const beforeBlocks = Object.keys(ct.beforeBlocks).map((k) => ({
      name: k,
      schema: ct.beforeBlocks[k],
    }))

    const afterBlocks = Object.keys(ct.afterBlocks).map((k) => ({
      name: k,
      schema: ct.afterBlocks[k],
    }))

    const extraBlocks = Object.keys(ct.extraBlocks).map((k) => ({
      name: k,
      blocks: Object.keys(ct.extraBlocks[k]).map((kk) => ({
        name: kk,
        schema: ct.extraBlocks[k][kk],
      })),
    }))

    acc.push({
      ...ct,
      blocks,
      beforeBlocks,
      afterBlocks,
      extraBlocks,
    })

    return acc
  }, [] as CMSContentType[])

  await outputJSON(
    join(root, 'public/page-data/_cms/contentTypes.json'),
    contentTypesCMS
  )
}

export const createPages = async ({
  actions: { createPage },
  reporter,
}: CreatePagesArgs) => {
  const blocksRootPath = join(root, 'src/@vtex/gatsby-plugin-cms/contents')

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

    reporter.info(`[${name}]: Updated page: ${slug}`)

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
