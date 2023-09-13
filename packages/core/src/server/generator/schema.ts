import { writeFileSync } from 'fs-extra'
import { getSchema, getTypeDefs } from '@faststore/api'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { buildASTSchema } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import type { TypeSource } from '@graphql-tools/utils'

import { apiOptions } from '../options'

export function getTypeDefsFromFolder(
  customPath: string | string[]
): TypeSource {
  const basePath = ['src', 'customizations', 'graphql']

  const pathArray = Array.isArray(customPath) ? customPath : [customPath]

  return (
    loadFilesSync([...basePath, ...pathArray, 'typeDefs'], {
      extensions: ['graphql'],
    }) ??
    loadFilesSync([...basePath, ...pathArray, 'typedefs'], {
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

export function getNativeTypeDefs() {
  return getTypeDefs() as TypeSource
}

export function getVTEXExtensionsTypeDefs() {
  return getTypeDefsFromFolder('vtex')
}

export function getThirdPartyExtensionsTypeDefs() {
  return getTypeDefsFromFolder('thirdParty')
}

export const nativeApiSchema = getSchema(apiOptions)

// Schema with no resolvers - used to generate schema.graphql file
export const getMergedSchema = (): GraphQLSchema =>
  getCustomSchema(
    [
      getNativeTypeDefs(),
      getVTEXExtensionsTypeDefs(),
      getThirdPartyExtensionsTypeDefs(),
    ].filter(Boolean)
  )

export function writeGraphqlSchemaFile(apiSchema: GraphQLSchema) {
  try {
    writeFileSync(
      [process.cwd(), '@generated', 'graphql', 'schema.graphql'].join('/'),
      printSchemaWithDirectives(apiSchema)
    )

    console.log('Schema GraphQL file generated successfully')
  } catch (e) {
    console.error('An error occurred while generating the GraphQL schema file')

    throw e
  }
}
