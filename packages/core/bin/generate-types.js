#! /usr/bin/env node

const { format } = require('prettier')
const prettierConfig = require('@vtex/prettier-config')
const deepmerge = require('deepmerge')
const defaultConfig = require('../discovery.config.default')
const path = require('path')
const fs = require('fs')
const { getTypeDefs } = require('@vtex/faststore-api')
const { printSchemaWithDirectives } = require('@graphql-tools/utils')
// const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs } = require('@graphql-tools/merge')
const {
  buildASTSchema,
  parse,
  Kind,
  OperationTypeNode,
  print,
} = require('graphql')
const { generate } = require('@graphql-codegen/cli')

const { globbySync } = require('globby')

const root = process.env.PWD ?? process.cwd()
const schemaFileName = path.join(__dirname, '../@generated', 'schema.graphql')
const discoveryConfigFileLocation = path.join(
  path.dirname(__filename),
  `../discovery.config.user.js`
)
const saveConfigFile = saveFile(discoveryConfigFileLocation)
const saveSchemaFile = saveFile(schemaFileName)

function extendsConfig(config) {
  return deepmerge(defaultConfig, config)
}

function saveFile(fileLocation) {
  fs.mkdirSync(path.dirname(fileLocation), { recursive: true })

  return (content) => {
    fs.writeFileSync(fileLocation, content)
  }
}

function getUserConfig() {
  const finalConfig = require(
    path.relative(
      path.dirname(__filename),
      path.resolve(root, 'discovery.config.js')
    )
  )

  return finalConfig?.default ?? finalConfig
}

function generateSchemaTSTypes(local = false) {
  // let documents = MapSRCFolder(path.resolve(__dirname, '../src'))
  // glob to include all ts/tsx files
  const documents = [`${path.resolve(__dirname, '../src')}/**/*.{ts,tsx}`]
  if (local === false) {
    // Find customizations
    const notDocs = MapSRCFolder(
      root,
      undefined,
      (str) => `src/customizations/${/^.+?(src.*)$/.exec(str)?.[1]}`
    )

    // remove customization from core folder
    Array.from(notDocs.keys()).forEach((el) =>
      documents.push(`!${path.resolve(__dirname, '..', el)}`)
    )
    // Add root customizations to replace from core folder
    documents.push(`${root}/**/*.{ts,tsx}`)
  }

  console.log(documents)

  /** @type {import('@graphql-codegen/cli').CodegenConfig} */
  const config = {
    documents,
    overwrite: true,
    errorsOnly: false,
    debug: false,
    verbose: true,
    schema: path.resolve(__dirname, '../@generated/schema.graphql'),
    generates: {
      [`${path.resolve(__dirname, '../@generated')}/`]: {
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
          onExecutableDocumentNode: (document) => ({
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

  return generate(config, true)
}

/**
 * @param {import('graphql').DocumentNode} document
 */
function getOperationName(document) {
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

function getTypeDefsFromFolder(customPath) {
  const basePath = [root, 'src', 'graphql']

  const pathArray = Array.isArray(customPath) ? customPath : [customPath]

  return globbySync(path.join(...[...basePath, ...pathArray]), {
    expandDirectories: {
      extensions: ['graphql'],
    },
  }).map((typeDef) => parse(fs.readFileSync(typeDef, { encoding: 'utf-8' })))
}

const getMergedSchema = () => {
  try {
    const mergedTypeDefs = mergeTypeDefs(
      [
        getTypeDefs({ platform: 'vtex' }),
        ...[
          ...getTypeDefsFromFolder('vtex'),
          ...getTypeDefsFromFolder('thirdParty'),
        ].map(print),
      ].filter(Boolean)
    )

    return buildASTSchema(mergedTypeDefs)
  } catch (e) {
    console.error(
      'An error occurred while attempting to merge the GraphQL Schema Extensions. Check the custom typeDefs and resolvers located in the "customizations/graphql/" directory. The changes since the last successful schema merge will be ignored.'
    )

    throw e
  }
}

const isDir = (str) => fs.lstatSync(str).isDirectory()

const defaultNormalize = (str) => {
  const r = /^.+?(src.*?)(src.*)?$/.exec(str)
  return r[1] + r[2]
}

function MapSRCFolder(
  destPath,
  mapped = new Map(),
  normalizeFn = defaultNormalize
) {
  destPath = isDir(destPath) ? destPath : path.dirname(destPath)

  for (const item of fs.readdirSync(destPath)) {
    const itemPath = path.join(destPath, item)
    if (
      isDir(itemPath) &&
      item !== 'node_modules' &&
      /^\./.test(item) === false
    ) {
      MapSRCFolder(itemPath, mapped, normalizeFn)
    } else if (
      ['.ts', '.tsx', '.js'].includes(path.extname(itemPath)) &&
      normalizeFn(itemPath).startsWith('src')
    ) {
      mapped.set(normalizeFn(itemPath), itemPath)
    }
  }

  return mapped
}

async function main() {
  const isLocal = (process.argv[2] ?? 'false') === 'true'

  saveSchemaFile(printSchemaWithDirectives(getMergedSchema()))
  await generateSchemaTSTypes(isLocal)

  if (!isLocal) {
    // removes next cached bundle
    const _nextFolderPath = path.resolve(root, '.next')
    fs.existsSync(_nextFolderPath) &&
      fs.rmdirSync(_nextFolderPath, { recursive: true })

    const queries = getQueries(
      require(path.join(__dirname, '../@generated', 'persisted-documents.json'))
    )
    const finalConfig = extendsConfig({
      ...getUserConfig(),
      experimental: {
        cachedOperations: queries,
      },
    })

    saveConfigFile(
      format(`module.exports = ${JSON.stringify(finalConfig, undefined, 2)}`, {
        ...prettierConfig,
        parser: 'typescript',
        quoteProps: 'as-needed',
      })
    )
  }
}

if (process.env.NODE_ENV !== 'test') main()

/** @param {Record<string, string>} persistedDocuments */
const getQueries = (persistedDocuments) => {
  const operationNames = []
  for (const operation of Object.values(persistedDocuments)) {
    let currentNames = []
    const operationAST = parse(operation)
    const hasMutationDefinition = operationAST.definitions.some(
      (def) =>
        def.kind === Kind.OPERATION_DEFINITION &&
        def.operation === OperationTypeNode.MUTATION
    )

    if (hasMutationDefinition) continue

    operationAST.definitions.forEach((definition) => {
      if (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.QUERY &&
        definition.name?.kind === Kind.NAME &&
        !!definition.name?.value
      ) {
        currentNames.push(definition.name.value)
        return true
      }

      return false
    })

    if (currentNames.length) {
      operationNames.push(...currentNames)
      currentNames = []
    }
  }

  return operationNames
}

module.exports = { getMergedSchema, getTypeDefsFromFolder }
