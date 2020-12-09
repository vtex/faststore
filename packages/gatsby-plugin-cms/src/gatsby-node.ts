import { join } from 'path'

import {
  ensureDir,
  outputFileSync,
  outputJSON,
  pathExists,
  readJSONSync,
} from 'fs-extra'
import globby from 'globby'
import type { JSONSchema6 } from 'json-schema'
import type { CreatePagesArgs } from 'gatsby'

import { ContentDOM } from './builder/compiler'
import { getMeta, isContent } from './common'
import type { ContentTypes, Schemas } from './index'

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

const CONTENT_TYPES_PATH = join(root, 'public/page-data/_cms/contentTypes.json')
const SHADOWED_INDEX_PATH = join(root, 'src', name, 'index.ts')
const BLOCKS_ROOT_PATH = join(root, 'src/@vtex/gatsby-plugin-cms/contents')
const GENERATED_ROOT_PATH = join(BLOCKS_ROOT_PATH, '/__generated__')
const PREVIEW_PATH = '/cms/preview'

const exportCMSConfig = async ({ graphql, reporter }: CreatePagesArgs) => {
  const { data, errors } = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)

  if (errors && errors.length > 0) {
    reporter.panicOnBuild(
      'Seomething went wrong while querying site metadata',
      errors
    )
  }

  const {
    site: {
      siteMetadata: { siteUrl },
    },
  }: { site: { siteMetadata: { siteUrl: string } } } = data as any

  // Read index.ts from shadowed plugin
  const exists = await pathExists(SHADOWED_INDEX_PATH)

  if (!exists) {
    return
  }

  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const { schemas, contentTypes } = require(SHADOWED_INDEX_PATH) as {
    schemas: Schemas
    contentTypes: ContentTypes
  }

  // Make sure all components have a schema
  for (const schema in schemas) {
    if (!('component' in schemas[schema])) {
      reporter.panicOnBuild(
        `${schema} does not have a registered component. Please add a property with component: lazy(() => import('path-to-component'))`
      )

      return
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
      previewUrl: join(siteUrl, PREVIEW_PATH),
      blocks,
      beforeBlocks,
      afterBlocks,
      extraBlocks,
    })

    return acc
  }, [] as CMSContentType[])

  await outputJSON(CONTENT_TYPES_PATH, contentTypesCMS)
}

const getGeneratedOutpath = (filename: string) =>
  join(GENERATED_ROOT_PATH, filename.replace('.json', '.tsx'))

const compileToTS = async ({
  actions: { createPage },
  reporter,
}: CreatePagesArgs) => {
  // ensure dist folder
  await ensureDir(GENERATED_ROOT_PATH)

  // Only create cms pages on dev mode for now
  if (process.env.NODE_ENV === 'production') {
    return
  }

  const files = await globby(['*.json'], { cwd: BLOCKS_ROOT_PATH })

  for (const filename of files) {
    const inpath = join(BLOCKS_ROOT_PATH, filename)
    const outpath = getGeneratedOutpath(filename)

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

    outputFileSync(outpath, src)

    createPage({
      path: slug,
      component: outpath,
      context: {},
    })
  }
}

export const createPages = (args: CreatePagesArgs) =>
  Promise.all([compileToTS(args), exportCMSConfig(args)])
