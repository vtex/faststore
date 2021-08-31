import { dirname, join } from 'path'

import * as typeScriptPlugin from '@graphql-codegen/typescript'
import * as typeScriptOperationsPlugin from '@graphql-codegen/typescript-operations'
import { codegen } from '@graphql-codegen/core'
import { optimizeDocuments } from '@graphql-tools/relay-operation-optimizer'
import { parse, print, printSchema } from 'graphql'
import {
  mkdirSync,
  outputJson,
  pathExistsSync,
  readFileSync,
  outputFile as fsExtraOutputFile,
} from 'fs-extra'
import type { GraphQLSchema } from 'graphql'

import { outputFile } from './filesystem'
import { QueryManager } from './manager'
import { hydrate, serialize } from './cache'
import type { Node } from './manager'

export interface QueryInfo {
  query?: string
  sha256Hash: string
}

const root = process.cwd()

export const persisted = 'persisted.graphql.json'
export const queryInfo = 'queryInfo.graphql.json'
export const cache = 'cache.graphql.txt'

export const publicPath = '/page-data/_graphql'

export const target = join(root, 'public', publicPath)

const disclaimer = `
/**
 * Warning: This is an autogenerated file.
 *
 * Changes in this file won't take effect and will be overwritten
 */
`

const queryCode = ({ name, value, sha256Hash }: QueryNode) => `
export const ${name} = {
  query: process.env.NODE_ENV === 'production' ? undefined : ${JSON.stringify(
    value
  )},
  sha256Hash: "${sha256Hash}",
  operationName: "${name}",
}
`

const wrapTypes = (types: string, node: QueryNode | null) => `
${disclaimer}

// Operation related types
${types}

// Query Related Code
${node ? queryCode(node) : ''}
`

const wrapSchema = (schema: string) =>
  `
${disclaimer}

${schema}
`.trim()

type QueryNode = Node & { sha256Hash: string }
type FragmentNode = Node

const isQueryNode = (node: any): node is QueryNode =>
  typeof node.sha256Hash === 'string'

export class WebpackPlugin {
  public persistedPath: string
  public queryInfoPath: string
  public cachePath: string

  constructor(
    public schema: GraphQLSchema,
    public options: { schemaPath: string; rootPath: string }
  ) {
    this.persistedPath = join(root, 'public', publicPath, persisted)
    this.queryInfoPath = join(root, 'public', publicPath, queryInfo)
    this.cachePath = join(root, 'public', publicPath, cache)

    mkdirSync(target, { recursive: true })

    // Hydrate cache
    if (pathExistsSync(this.cachePath)) {
      hydrate(
        readFileSync(this.cachePath).toString(),
        QueryManager.getSingleton()
      )
    }
  }

  public optimizeQuery = (query: string) => {
    const document = parse(query)

    const optimized = optimizeDocuments(this.schema, [document], {
      includeFragments: false,
    })

    return print(optimized[0])
  }

  public generateSchemaCode = async () =>
    codegen({
      config: {
        allowEnumStringTypes: false,
        avoidOptionals: true,
        enumsAsTypes: true,
        skipTypeNameForRoot: true,
        skipTypename: true,
        noExport: true,
        namingConvention: 'change-case-all#pascalCase',
      },
      documents: [],
      // used by a plugin internally, although the 'typescript' plugin currently
      // returns the string output, rather than writing to a file
      filename: this.options.schemaPath,
      schemaAst: this.schema,
      schema: parse(printSchema(this.schema)),
      // Plugins to use
      pluginMap: {
        typeScript: typeScriptPlugin,
      },
      // Plugins configurations
      plugins: [
        {
          typeScript: {},
        },
      ],
    }).then(wrapSchema)

  public generateOperationsCode = async (
    nodes: Array<QueryNode | FragmentNode>
  ) => {
    return Promise.all(
      nodes.map(async (node) => {
        const { value, filename, ...rest } = node
        const types = await codegen({
          config: {
            preResolveTypes: true,
            avoidOptionals: true,
            enumsAsTypes: true,
            skipTypeNameForRoot: true,
            skipTypename: true,
            namingConvention: 'change-case-all#pascalCase',
          },
          documents: [{ document: parse(value) }],
          // used by a plugin internally, although the 'typescript' plugin currently
          // returns the string output, rather than writing to a file
          filename,
          schemaAst: this.schema,
          schema: parse(printSchema(this.schema)),
          // Plugins to use
          pluginMap: {
            typeScriptOperations: typeScriptOperationsPlugin,
          },
          // Plugins configurations
          plugins: [
            {
              typeScriptOperations: {},
            },
          ],
        })

        const queryNode = isQueryNode(node) ? node : null

        return {
          ...rest,
          value: wrapTypes(types, queryNode),
          filename,
        }
      })
    )
  }

  public apply(compiler: any) {
    compiler.hooks.done.tapPromise('gatsby-plugin-graphql', async () => {
      try {
        const manager = QueryManager.getSingleton()
        const allQueries = manager.getQueries()
        const allFragments = manager.getFragments()

        if (allQueries.length === 0) {
          return
        }

        // -------------------------------------
        // Optimize queries using Relay Compiler
        const optimizedQueries = allQueries.map(({ value, ...rest }) => ({
          value: this.optimizeQuery(value),
          ...rest,
        }))

        // -------------------------------------
        // Create Persisted Query Map
        const persistedQueryMap = optimizedQueries.reduce(
          (acc, { value, sha256Hash }) => {
            acc[sha256Hash] = value

            return acc
          },
          {} as Record<string, string>
        )

        await outputJson(this.persistedPath, persistedQueryMap)

        // -------------------------------------
        // Create Query Info to be used in the browser for making requests
        const queryInfoMap = optimizedQueries.reduce(
          (acc, { name, value, sha256Hash }) => {
            acc[name] = { query: value, sha256Hash }

            return acc
          },
          {} as Record<string, QueryInfo>
        )

        await outputJson(this.queryInfoPath, queryInfoMap)

        // -------------------------------------
        // Generate code using @graphql-codegen
        const [schemaNode, operationNodes] = await Promise.all([
          this.generateSchemaCode(),
          this.generateOperationsCode([...optimizedQueries, ...allFragments]),
        ])

        // write generated files
        await Promise.all([
          ...operationNodes.map(async ({ value, name }) => {
            const filename = join(this.options.rootPath, `${name}.graphql.ts`)

            return outputFile(filename, value)
          }),
          outputFile(this.options.schemaPath, schemaNode),
        ])

        await fsExtraOutputFile(this.cachePath, serialize(manager))
      } catch (err) {
        console.error('[gatsby-plugin-graphql]', err)
      }
    })
  }
}
