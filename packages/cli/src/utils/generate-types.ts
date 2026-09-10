import { saveFile } from './file'
import { GraphqlVtexSchema } from '@faststore/api'
import {
  generate as codegenGenerate,
  type CodegenConfig,
} from '@graphql-codegen/cli'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import { buildASTSchema, Kind, parse, type DocumentNode } from 'graphql'
import fs, { existsSync } from 'node:fs'
import path from 'node:path'

const schemaFileName = 'schema.graphql'

export default async function genTsTypes(at: string) {
  await generateSchemaFile(at)
  await generateSchemaTSTypes(at)
}

/**
 * Codegen pointers (documents glob, schema and output dir) for a project root.
 *
 * They are expressed relative to `cwd` — the directory graphql-codegen resolves
 * pointers from — instead of as absolute paths. `@graphql-tools/load` treats a
 * pointer that contains whitespace and is not a parseable SDL as a broken
 * inline document and throws, so an absolute glob under e.g.
 * `/Users/me/My Store/.faststore` made `faststore build` fail with
 * "Failed to parse the GraphQL document". The relative form never includes the
 * parent directories, so it is unaffected by their names.
 */
export async function getCodegenPointers(
  root: string,
  cwd: string = process.cwd()
) {
  const globbyImport = (await import('globby')) as GlobbyModule & {
    default?: GlobbyModule
  }
  const globbyModule = globbyImport.default ?? globbyImport

  let finalRootPath = path.resolve(root)

  if (existsSync(path.resolve(root, '.faststore'))) {
    finalRootPath = path.resolve(root, '.faststore')
  }

  // resolve symlinks on both sides (e.g. /var -> /private/var on macOS) so the
  // relative path does not climb back through the parent directories
  const realCwd = realpathIfExists(cwd)
  const relativeTo = (target: string) =>
    path.relative(realCwd, realpathIfExists(target)) || '.'

  // globs must use forward slashes on every platform, and glob-special
  // characters in the relative segments (e.g. parentheses) must be escaped
  const toPattern = (target: string) =>
    globbyModule.convertPathToPattern(relativeTo(target))

  // plain relative path (no glob escaping): this one is used as a file path
  const toRelativePath = (target: string) =>
    relativeTo(target).split(path.sep).join('/')

  return {
    // glob to include all ts/tsx files
    documents: [`${toPattern(path.join(finalRootPath, 'src'))}/**/*.{ts,tsx}`],
    schema: toRelativePath(
      path.join(finalRootPath, '@generated', schemaFileName)
    ),
    // trailing slash: tells the client preset the output is a folder
    outputDir: `${toRelativePath(path.join(finalRootPath, '@generated'))}/`,
  }
}

/**
 * `fs.realpathSync` for paths that may not exist yet (e.g. `@generated` before
 * the first run): resolves the closest existing ancestor and re-appends the
 * missing tail.
 */
function realpathIfExists(target: string): string {
  const missing: string[] = []
  let current = path.resolve(target)

  while (!existsSync(current)) {
    const parent = path.dirname(current)

    if (parent === current) {
      return path.resolve(target)
    }

    missing.unshift(path.basename(current))
    current = parent
  }

  return path.join(fs.realpathSync.native(current), ...missing)
}

async function generateSchemaTSTypes(root: string) {
  const { documents, schema, outputDir } = await getCodegenPointers(root)

  const config: CodegenConfig = {
    documents,
    overwrite: true,
    errorsOnly: false,
    debug: false,
    verbose: true,
    schema,
    generates: {
      [outputDir]: {
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
    const root = path.join(
      rootPath.endsWith('.faststore') ? [rootPath, '..'].join('/') : rootPath
    )

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

  let pathToSave = path.resolve(rootPath, '@generated', schemaFileName)

  if (existsSync(path.resolve(rootPath, '.faststore'))) {
    pathToSave = path.resolve(
      rootPath,
      '.faststore',
      '@generated',
      schemaFileName
    )
  }

  const saveSchemaFile = saveFile(pathToSave)
  const finalSchema = printSchemaWithDirectives(await getMergedSchema())

  saveSchemaFile(finalSchema)
}

type GlobbyModule = typeof import('globby')

export async function getTypeDefsFromFolder(
  root: string,
  customPath: string | string[]
) {
  const globbyImport = (await import('globby')) as GlobbyModule & {
    default?: GlobbyModule
  }
  const globbyModule = globbyImport.default ?? globbyImport
  const basePath = [root, 'src', 'graphql']

  const pathArray = Array.isArray(customPath) ? customPath : [customPath]

  // globby patterns must use forward slashes — on Windows, path.join produces
  // backslashes, which globby treats as escape characters and matches nothing
  const pattern = globbyModule.convertPathToPattern(
    path.join(...basePath, ...pathArray)
  )

  // spell out the glob instead of using expandDirectories: it stats the
  // escaped pattern string, so it never expands paths that needed escaping
  // (e.g. parentheses in a parent directory name)
  return globbyModule
    .globbySync(`${pattern}/**/*.graphql`)
    .map((typeDef: string) =>
      parse(fs.readFileSync(typeDef, { encoding: 'utf-8' }))
    )
}
