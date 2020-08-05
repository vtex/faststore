import { join, basename, dirname } from 'path'

import { codegen } from '@graphql-codegen/core'
import { Types } from '@graphql-codegen/plugin-helpers'
import * as typescriptPlugin from '@graphql-codegen/typescript'
import * as typeScriptOperationsPlugin from '@graphql-codegen/typescript-operations'
import { optimizeDocuments } from '@graphql-tools/relay-operation-optimizer'
import { mkdirSync, outputFile, outputJson } from 'fs-extra'
import { GraphQLSchema, parse, print, printSchema } from 'graphql'

import { QueryInfo } from '.'
import { QueryManager, Node } from './manager'

const root = process.cwd()

export const persisted = 'persisted.graphql.json'
export const queryInfo = 'queryInfo.graphql.json'

export const publicPath = '/page-data/_graphql'

export const target = join(root, 'public', publicPath)

export class WebpackPlugin {
  public persistedPath: string
  public queryInfoPath: string

  constructor(public schema: GraphQLSchema) {
    this.persistedPath = join(root, 'public', publicPath, persisted)
    this.queryInfoPath = join(root, 'public', publicPath, queryInfo)

    mkdirSync(target, { recursive: true })
  }

  public optimizeQuery = (query: string) => {
    const document = parse(query)

    const optimized = optimizeDocuments(this.schema, [document], {
      includeFragments: false,
    })

    return print(optimized[0])
  }

  public generateCode = async (nodes: Node[]) => {
    const promises = nodes.map(async ({ value, filename }) => {
      const config: Types.GenerateOptions = {
        config: {
          avoidOptionals: true,
          addOperationExport: true,
          skipTypeNameForRoot: true,
        },
        documents: [{ document: parse(value) }],
        // used by a plugin internally, although the 'typescript' plugin currently
        // returns the string output, rather than writing to a file
        filename: this.generatedPath,
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
      }

      const types = await codegen(config)

      return {
        value: types,
        filename,
      }
    })

    const generated = await Promise.all(promises)

    return generated
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
          (acc, { operationName, value, sha256Hash }) => {
            acc[operationName] = { query: value, sha256Hash }

            return acc
          },
          {} as Record<string, QueryInfo>
        )

        await outputJson(this.queryInfoPath, queryInfoMap)

        // -------------------------------------
        // Generate code using @graphql-codegen
        const codeNodes = await this.generateCode([
          ...optimizedQueries,
          ...allFragments,
        ])

        // write generated files
        await Promise.all(
          codeNodes.map(async ({ value, filename: filepath }) => {
            const filename = join(
              dirname(filepath),
              '__generated__',
              basename(filepath).replace('.tsx', '.ts')
            )

            return outputFile(filename, value)
          })
        )
      } catch (err) {
        console.error('[gatsby-plugin-graphql]', err)
      }
    })
  }
}
