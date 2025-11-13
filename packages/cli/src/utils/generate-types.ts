import { GraphqlVtexSchema } from '@faststore/api'
import {
  generate as codegenGenerate,
  type CodegenConfig,
} from '@graphql-codegen/cli'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import { buildASTSchema, Kind, parse, type DocumentNode } from 'graphql'
import fs from 'node:fs'
import path from 'node:path'

const schemaFileName = 'schema.graphql'

export default async function genTsTypes(at: string) {
  await generateSchemaFile(at)
  generateSchemaTSTypes(at)
}

function generateSchemaTSTypes(root: string) {
  // let documents = MapSRCFolder(path.resolve(__dirname, '../src'))
  // glob to include all ts/tsx files
  const documents = [`${path.resolve(root, 'src')}/**/*.{ts,tsx}`]

  const config: CodegenConfig = {
    documents,
    overwrite: true,
    errorsOnly: false,
    debug: false,
    verbose: true,
    schema: path.resolve(root, '@generated', schemaFileName),
    generates: {
      [`${path.resolve(root, '@generated')}/`]: {
        preset: 'client',
        config: {
          /** Not all of these properties are supported by the preset, but it reflects our previous config when we used typescript plugins directly */
          preResolveTypes: true,
          avoidOptionals: true,
          enumsAsTypes: true,
          skipTypeNameForRoot: true,
          skipTypename: true,
          allowEnumStringTypes: false,
          flattenGeneratedTypes: true,
          namingConvention: 'change-case-all#pascalCase',
          exportFragmentSpreadSubTypes: true,
          /** Removes useless AST definitions from documents */
          documentMode: 'string',
        },
        presetConfig: {
          // Disabled fragment masking - it wasn't being used by us. This can be reviewed in the future
          fragmentMasking: false,
          // Recognizes the gql(`query { ... }`) calls and generates the types for them
          gqlTagName: 'gql',
          onExecutableDocumentNode: (document: DocumentNode) => ({
            // This makes sure that the operation name is always present in the __meta__ field of each query
            // This helps us to identify the query in the persisted documents and to debug errors in the client
            operationName: getOperationName(document),
          }),
          persistedDocuments: {
            // Keeps document simple, including only necessary properties as '__meta__' and its properties
            mode: 'replaceDocumentWithHash',
            // replaces operation['__meta__']['hash'] with operation['__meta__']['operationHash']
            hashPropertyName: 'operationHash',
          },
        },
      },
    },
  }

  return codegenGenerate(config, true)
}

function getOperationName(document: DocumentNode) {
  for (const definition of document.definitions) {
    if (
      definition.kind === Kind.OPERATION_DEFINITION &&
      typeof definition.name?.value === 'string'
    ) {
      return definition.name.value
    }
  }

  return 'UnknownOperation'
}

async function generateSchemaFile(rootPath: string) {
  const faststoreSchema = printSchemaWithDirectives(GraphqlVtexSchema())

  const getMergedSchema = async () => {
    const root = process.env.PWD ?? process.cwd()
    const customizations = [
      ...(await getTypeDefsFromFolder(root, 'vtex')),
      ...(await getTypeDefsFromFolder(root, 'thirdParty')),
    ]
    try {
      const mergedTypeDefs = mergeTypeDefs(
        [faststoreSchema, ...customizations].filter(Boolean)
      )

      return buildASTSchema(mergedTypeDefs)
    } catch (e) {
      console.error(
        'An error occurred while attempting to merge the GraphQL Schema Extensions. Check the custom typeDefs and resolvers located in the "customizations/graphql/" directory. The changes since the last successful schema merge will be ignored.'
      )

      throw e
    }
  }

  const saveSchemaFile = saveFile(
    path.resolve(rootPath, '@generated', schemaFileName)
  )
  const finalSchema = printSchemaWithDirectives(await getMergedSchema())

  saveSchemaFile(finalSchema)
}

import { globbySync } from 'globby'

async function getTypeDefsFromFolder(root: string, customPath: string) {
  // const globby = await import('globby')

  const basePath = [root, 'src', 'graphql']

  const pathArray = Array.isArray(customPath) ? customPath : [customPath]

  return globbySync(path.join(...[...basePath, ...pathArray]), {
    expandDirectories: {
      extensions: ['graphql'],
    },
  }).map((typeDef) => parse(fs.readFileSync(typeDef, { encoding: 'utf-8' })))
}

function saveFile(fileLocation: string) {
  fs.mkdirSync(path.dirname(fileLocation), { recursive: true })

  return (content: string) => {
    fs.writeFileSync(fileLocation, content)
  }
}
