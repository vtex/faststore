import { join } from 'path'

import { outputJSON, pathExists } from 'fs-extra'
import type { JSONSchema6 } from 'json-schema'
import type { PluginOptionsSchemaArgs, SourceNodesArgs } from 'gatsby'
import {
  buildNodeDefinitions,
  compileNodeQueries,
  createDefaultQueryExecutor,
  createSchemaCustomization,
  generateDefaultFragments,
  loadSchema,
  sourceAllNodes,
} from 'gatsby-graphql-source-toolkit'

import type { BuilderConfig } from './index'

// VTEX IO workspace
const WORKSPACE = 'master'

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

interface Options {
  tenant: string
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    tenant: Joi.string().required(),
  })

export const sourceNodes = async (
  args: SourceNodesArgs,
  { tenant }: Options
) => {
  // Step1. Set up remote schema:
  const executor = createDefaultQueryExecutor(
    `https://${WORKSPACE}--${tenant}.myvtex.com/graphql`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    }
  )

  const schema = await loadSchema(executor)

  // Step2. Configure Gatsby node types
  const gatsbyNodeTypes = [
    {
      remoteTypeName: `PageContent`,
      queries: `
        query LIST_PAGES ($first: Int!, $after: String ) {
          vtex {
            pages (first: $first, after: $after, builderId: "faststore") {
              edges {
                node {
                  ...PageContentFragment
                }
              }
            }
          }
        }
        fragment PageContentFragment on PageContent { __typename id }
      `,
    },
  ]

  // Step3. Provide (or generate) fragments with fields to be fetched
  const fragments = generateDefaultFragments({ schema, gatsbyNodeTypes })

  // Step4. Compile sourcing queries
  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  })

  const config = {
    gatsbyApi: args,
    schema,
    execute: executor,
    gatsbyTypePrefix: 'vtexCms',
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
  }

  // Step5. Add explicit types to gatsby schema
  await createSchemaCustomization(config)

  // Step6. Source nodes
  await sourceAllNodes(config)
}

export const createPages = async () => {
  // Read index.ts from shadowed plugin
  const exists = await pathExists(SHADOWED_INDEX_PATH)

  if (!exists) {
    return
  }

  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const {
    builderConfig: { contentTypes: ctypes, blocks: blks, messages },
  } = require(SHADOWED_INDEX_PATH) as {
    builderConfig: BuilderConfig
  }

  const blocks = Object.keys(blks).map((k) => ({
    name: k,
    schema: blks[k],
  }))

  // Transform all contentTypes into CMS contentTypes format
  const contentTypes = Object.keys(ctypes).reduce((acc, key) => {
    const ct = ctypes[key]

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
      id: key,
      name: key,
      beforeBlocks,
      afterBlocks,
      extraBlocks,
    })

    return acc
  }, [] as CMSContentType[])

  const builderConfig: CMSBuilderConfig = {
    id: 'faststore',
    name: 'Powered by Gatsby Plugin CMS',
    contentTypes,
    blocks,
    messages,
  }

  await outputJSON(BUILDER_CONFIG_PATH, builderConfig)
}
