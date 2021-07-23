import { join } from 'path'

import { outputJSON, pathExists } from 'fs-extra'
import type { JSONSchema6 } from 'json-schema'
import type {
  CreatePagesArgs,
  SourceNodesArgs,
  PluginOptionsSchemaArgs,
} from 'gatsby'

import { fetchAllNodes } from './node-api/fetchNodes'
import type { BuilderConfig } from './index'
import { createSchemaCustomization, sourceNode } from './node-api/sourceNode'
import { sourceAllLocalNodes } from './node-api/sourceLocalNodes'

interface CMSContentType {
  id: string
  name: string
  beforeBlocks: Array<{ name: string; schema: JSONSchema6 }>
  afterBlocks: Array<{ name: string; schema: JSONSchema6 }>
  extraBlocks: Array<{
    name: string
    blocks: Array<{ name: string; schema: JSONSchema6 }>
  }>
}

interface CMSBuilderConfig {
  id: 'faststore'
  name: 'Powered by Gatsby Plugin CMS'
  productionBaseUrl: string
  blocks: Array<{ name: string; schema: JSONSchema6 }>
  contentTypes: CMSContentType[]
  messages: Record<string, string>
}

const { name } = require('./package.json')

const root = process.cwd()

const BUILDER_CONFIG_PATH = join(
  root,
  'public/page-data/_cms/builderConfig.json'
)

const SHADOWED_INDEX_PATH = join(root, 'src', name, 'index.ts')

export interface Options {
  tenant: string
  workspace?: string
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    tenant: Joi.string().required(),
    workspace: Joi.string(),
  })

export const sourceNodes = async (
  gatsbyApi: SourceNodesArgs,
  options: Options
) => {
  const nodes = await fetchAllNodes(gatsbyApi, options)

  createSchemaCustomization(gatsbyApi, nodes)

  for (const node of nodes) {
    sourceNode(gatsbyApi, node)
  }

  await sourceAllLocalNodes(gatsbyApi, process.cwd(), '@vtex/gatsby-plugin-cms')
}

export const createPages = async ({ graphql, reporter }: CreatePagesArgs) => {
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

  // eslint-disable-next-line node/global-require
  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const {
    builderConfig: {
      contentTypes: userContentTypes = {},
      blocks: userBlocks = {},
      messages = {},
    } = {},
    // eslint-disable-next-line node/global-require
  } = require(SHADOWED_INDEX_PATH) as {
    builderConfig: BuilderConfig
  }

  const blocks = Object.keys(userBlocks).map((blockName) => ({
    name: blockName,
    schema: userBlocks[blockName],
  }))

  // Transform all contentTypes into CMS contentTypes format
  const contentTypes = Object.keys(userContentTypes).reduce(
    (acc, contentTypeName) => {
      const contentType = userContentTypes[contentTypeName]

      const beforeBlocks = Object.keys(contentType.beforeBlocks).map(
        (blockName) => ({
          name: blockName,
          schema: contentType.beforeBlocks[blockName],
        })
      )

      const afterBlocks = Object.keys(contentType.afterBlocks).map(
        (blockName) => ({
          name: blockName,
          schema: contentType.afterBlocks[blockName],
        })
      )

      const extraBlocks = Object.keys(contentType.extraBlocks).map(
        (sectionName) => ({
          name: sectionName,
          blocks: Object.keys(contentType.extraBlocks[sectionName]).map(
            (blockName) => ({
              name: blockName,
              schema: contentType.extraBlocks[sectionName][blockName],
            })
          ),
        })
      )

      acc.push({
        ...contentType,
        id: contentTypeName,
        beforeBlocks,
        afterBlocks,
        extraBlocks,
      })

      return acc
    },
    [] as CMSContentType[]
  )

  const builderConfig: CMSBuilderConfig = {
    id: 'faststore',
    name: 'Powered by Gatsby Plugin CMS',
    productionBaseUrl: siteUrl,
    contentTypes,
    blocks,
    messages,
  }

  await outputJSON(BUILDER_CONFIG_PATH, builderConfig)
}
