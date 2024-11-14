import path from 'path'
import { writeFileSync } from 'fs-extra'
import { getTypeDefs } from '@faststore/api'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { buildASTSchema } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import type { TypeSource } from '@graphql-tools/utils'
import storeConfig from '../../../discovery.config'

type PageConfig = {
  path: string
  appLayout: boolean
  name: string
}

type Plugin =
  | string
  | {
      [pluginName: string]: {
        pages?: { [pageName: string]: Partial<PageConfig> }
      }
    }

const customBasePath = ['src', 'customizations', 'src', 'graphql']

export function getTypeDefsFromFolder(...customPath: string[]): TypeSource {
  return (
    loadFilesSync([...customPath, 'typeDefs'], {
      extensions: ['graphql'],
    }) ??
    loadFilesSync([...customPath, 'typedefs'], {
      extensions: ['graphql'],
    })
  )
}

export function getCustomSchema(typeDefs: TypeSource[]) {
  try {
    const mergedTypeDefs = mergeTypeDefs(typeDefs)

    const schema = buildASTSchema(mergedTypeDefs)

    return schema
  } catch (e) {
    console.error(
      'An error occurred while attempting to merge the GraphQL Schema Extensions. Check the custom typeDefs and resolvers located in the "customizations/graphql/" directory. The changes since the last successful schema merge will be ignored.'
    )

    throw e
  }
}

export const getPluginsTypeDefs = (): TypeSource[] => {
  const { plugins = [] } = storeConfig

  return (plugins as Plugin[])
    .map((plugin) => {
      if (typeof plugin === 'string') {
        return plugin
      }

      return Object.keys(plugin)[0]
    })
    .map((pluginName) => {
      const pluginPath = path.join(process.cwd(), 'node_modules', pluginName)

      return getTypeDefsFromFolder(pluginPath, 'graphql')
    })
}

export function getNativeTypeDefs() {
  return getTypeDefs() as TypeSource
}

export function getVTEXExtensionsTypeDefs() {
  return getTypeDefsFromFolder(...customBasePath, 'vtex')
}

export function getThirdPartyExtensionsTypeDefs() {
  return getTypeDefsFromFolder(...customBasePath, 'thirdParty')
}

// Schema with no resolvers - used to generate schema.graphql file
export const getMergedSchema = (): GraphQLSchema =>
  getCustomSchema(
    [
      getNativeTypeDefs(),
      getVTEXExtensionsTypeDefs(),
      getThirdPartyExtensionsTypeDefs(),
      ...getPluginsTypeDefs(),
    ].filter(Boolean)
  )

export function writeGraphqlSchemaFile(apiSchema: GraphQLSchema) {
  try {
    // getting the schema before write because somehow this fixes the validation step of codegen from codesandbox
    const schema = printSchemaWithDirectives(apiSchema)
    writeFileSync(
      path.join(process.cwd(), '@generated', 'schema.graphql'),
      schema
    )

    console.log('Schema GraphQL file generated successfully')
  } catch (e) {
    console.error('An error occurred while generating the GraphQL schema file')

    throw e
  }
}
