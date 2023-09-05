import { getSchema, getTypeDefs } from '@faststore/api'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'

import vtexExtensionsResolvers from '../customizations/graphql/vtex/resolvers'
import thirdPartyResolvers from '../customizations/graphql/thirdParty/resolvers'
import { apiOptions } from './options'

type resolversType = Parameters<typeof makeExecutableSchema>[0]['resolvers']

export function getTypeDefsFromFolder(customPath: string | string[]) {
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

export function getCustomSchema(customPath: string, resolvers: resolversType) {
  const customTypeDefs = getTypeDefsFromFolder(customPath)

  try {
    const typeDefs = mergeTypeDefs([...getTypeDefs(), customTypeDefs])

    const schema = makeExecutableSchema({ typeDefs, resolvers })

    return schema
  } catch (error) {
    const capitalizedPath =
      customPath.charAt(0).toUpperCase() + customPath.slice(1)
    console.error(
      `
      An error occurred while attempting to create the ${capitalizedPath} Extension GraphQL Schema. Check the custom typeDefs and resolvers located in the 'customizations/graphql/${customPath}' directory. This schema will be ignored.

      Error message:`,
      error
    )
  }
}

export function getVTEXExtensionsSchema() {
  return getCustomSchema('vtex', vtexExtensionsResolvers)
}

export function getThirdPartyExtensionsSchema() {
  return getCustomSchema('thirdParty', thirdPartyResolvers)
}

export const nativeApiSchema = getSchema(apiOptions)

export const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [
      await nativeApiSchema,
      getVTEXExtensionsSchema(),
      getThirdPartyExtensionsSchema(),
    ].filter(Boolean),
  })

export const apiSchema = getMergedSchemas()
