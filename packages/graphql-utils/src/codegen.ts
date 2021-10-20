import { optimizeDocuments } from '@graphql-tools/relay-operation-optimizer'
import { Kind, print } from 'graphql'
import type { Types, PluginFunction } from '@graphql-codegen/plugin-helpers'
import type { DocumentNode, GraphQLSchema } from 'graphql'

type Config = Record<string, unknown>

const getOperationName = (document: DocumentNode) => {
  for (const definition of document.definitions) {
    if (
      definition.kind === Kind.OPERATION_DEFINITION &&
      typeof definition.name?.value === 'string'
    ) {
      return definition.name.value
    }
  }

  return null
}

export const plugin: PluginFunction<Config, string> = async (
  schema: GraphQLSchema,
  files: Types.DocumentFile[],
  _: Config
) => {
  const documents = files
    .map(({ document }) => document)
    .filter((d): d is DocumentNode => typeof d !== 'undefined')

  const optimizedDocuments = optimizeDocuments(schema, documents, {
    includeFragments: false,
  })

  const operationToDocument = optimizedDocuments.reduce((acc, doc) => {
    const operationName = getOperationName(doc)

    if (typeof operationName === 'string') {
      if (acc[operationName]) {
        throw new Error(
          `Duplicated operation definition. Please rename one of the ${operationName} queries`
        )
      }

      acc[operationName] = print(doc)
    }

    return acc
  }, {} as Record<string, string>)

  return JSON.stringify(operationToDocument)
}
