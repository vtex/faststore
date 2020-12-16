import { join } from 'path'

import ConfigStore from 'configstore'
import { outputJSON, pathExists } from 'fs-extra'
import fetch from 'isomorphic-unfetch'
import pMap from 'p-map'
import type { JSONSchema6 } from 'json-schema'
import type {
  CreatePagesArgs,
  PluginOptionsSchemaArgs,
  SourceNodesArgs,
} from 'gatsby'

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
const PREVIEW_PATH = '/cms/preview'

interface Options {
  tenant: string
  appKey: string
  appToken: string
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    tenant: Joi.string().required(),
    appKey: Joi.string(),
    appToken: Joi.string(),
  })

const getAccessToken = async (appKey: string, appToken: string) => {
  try {
    if (!appKey || !appToken) {
      const config = new ConfigStore('vtex')

      return config.get('token')
    }

    const response = await fetch(
      `https://vtexid.vtex.com.br/api/vtexid/pub/authenticate/default?user=${appKey}&pass=${appToken}`,
      {
        headers: {
          accept: 'application/json',
        },
      }
    )

    const json = await response.json()

    return json.authCookie.Value
  } catch (err) {
    console.error(err)

    return ''
  }
}

export const sourceNodes = async (
  {
    reporter,
    actions: { createNode },
    createContentDigest,
    createNodeId,
  }: SourceNodesArgs,
  { tenant, appKey, appToken }: Options
) => {
  const accessToken = await getAccessToken(appKey, appToken)

  if (!accessToken) {
    reporter.panicOnBuild(
      'No appKey/appToken or local config found. Please login with `vtex login` or add the appKey/appToken env vars'
    )

    return
  }

  const fetcher = async (query: string, variables: any) => {
    const response = await fetch(
      // `https://app.io.vtex.com/vtex.admin-cms-graphql/v0/${tenant}/master/_v/graphql`
      `https://gimenes--${tenant}.myvtex.com/_v/private/graphql/v1`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          cookie: `VtexIdclientAutCookie=${accessToken}`,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    )

    if (response.status > 300 || response.status < 100) {
      const text = await response.text()

      reporter.panicOnBuild(text)

      return
    }

    const { data, errors } = await response.json()

    if (Array.isArray(errors) && errors.length > 0) {
      reporter.panicOnBuild(JSON.stringify(errors, null, 2))

      return
    }

    return data
  }

  const fetchTotal = async (first: number, offset: number) =>
    fetcher(
      `query GetTotalContent ($first: Int!, $offset: Int!) {
        contentList(filters: {first: $first, offset: $offset, builderId: "faststore", statuses: [draft, live]}) {
          total
        }
      }`,
      {
        first,
        offset,
      }
    )

  const fetchList = async (first: number, offset: number) =>
    fetcher(
      `query ListContent ($first: Int!, $offset: Int!) {
        contentList(filters: {first: $first, offset: $offset, builderId: "faststore", statuses: [draft, live]}) {
          entries {
            id
            type
          }
        }
      }`,
      {
        first,
        offset,
      }
    )

  const fechContentById = async (id: string, type: string) =>
    fetcher(
      `query GetContentById ($id: ID!, $type: String!) {
        content(id: $id, builderId: "faststore", contentTypeName: $type) {
          variants {
            status
            id
            extraBlocks {
              name
              blocks {
                name
                props
              }
            }
            blocks {
              id
              name
              props
            }
          }
        }
      }`,
      {
        id,
        type,
      }
    )

  // List all content ids

  const pageSize = 30
  const {
    contentList: { total },
  } = await fetchTotal(1, 0)

  const pages = new Array(Math.ceil(total / pageSize))

  let progress = reporter.createProgress(
    'List VTEX CMS content',
    pages.length,
    0
  )

  progress.start()

  const entries = await pMap(
    pages,
    async (_, page) => {
      const {
        contentList: { entries: es },
      } = await fetchList(pageSize, page * pageSize)

      progress.tick()

      return es
    },
    { concurrency: 1 }
  ).then((e) => e.flat())

  progress.done()

  // Fetch all content

  progress = reporter.createProgress(
    'Fetch VTEX CMS content',
    entries.length,
    0
  )

  progress.start()

  const contents = await pMap(
    entries,
    async ({ id, type }) => {
      const {
        content: { variants },
      } = await fechContentById(id, type)

      progress.tick()

      return variants.map((x: any) => ({ ...x, type }))
    },
    {
      concurrency: 20,
    }
  ).then((c) => c.flat())

  progress.done()

  const NODE_TYPE = 'VTEX_CMS'

  for (const content of contents) {
    const { id } = content

    createNode({
      ...content,
      id: createNodeId(`${NODE_TYPE}-${id}`),
      internal: {
        type: NODE_TYPE,
        content: JSON.stringify(content),
        contentDigest: createContentDigest(content),
      },
    })
  }
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

  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const { contentTypes } = require(SHADOWED_INDEX_PATH) as {
    schemas: Schemas
    contentTypes: ContentTypes
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

    acc[key] = {
      ...ct,
      previewUrl: join(siteUrl, PREVIEW_PATH),
      blocks,
      beforeBlocks,
      afterBlocks,
      extraBlocks,
    }

    return acc
  }, {} as Record<string, CMSContentType>)

  await outputJSON(CONTENT_TYPES_PATH, contentTypesCMS)
}
