import { resolve } from 'path'
import { parse as parseJSONC } from 'jsonc-parser'
import { readFileSync, readdir, stat } from 'fs-extra'
import chalk from 'chalk'

import { formSchema as MockSchema } from './__mockSchema__'
import { CliUx } from '@oclif/core'

//const SCHEMA_REGISTRY_BASE_URL =
//  "https://api.vtexcommercebeta.com.br/api/content-platform/schemas";

// const SCHEMA_REGISTRY_BASE_URL = 'http://localhost:3002'

const CP_COMPONENT_SCHEMA_REGEX = /(?:^|\/)cp_schema[^/]*\.(json|jsonc)$/
const CP_CONTENT_TYPE_SCHEMA_REGEX =
  /(?:^|\/)cp_content_schema[^/]*\.(json|jsonc)$/

// This implementation is necessary to support Node 18.x, as it doesn't have
// support for `recursive: true` in `fs.readdir`.
async function listFilesRecursive(basePath: string, matchPattern: RegExp) {
  const isBasePathAFile = (await stat(basePath)).isFile()

  if (isBasePathAFile) {
    return [basePath]
  }

  const filesInPath = await readdir(basePath, { withFileTypes: true })

  const files: (string | string[])[] = await Promise.all(
    filesInPath.map((fileInPath) => {
      const resolvedPath = resolve(basePath, fileInPath.name)

      return fileInPath.isDirectory()
        ? listFilesRecursive(resolvedPath, matchPattern)
        : resolvedPath
    })
  )

  return files.flat()?.filter((path) => matchPattern.test(path))
}

async function fetchFastStoreSchema(localSchemaPath: string | null) {
  // const fastStoreSchema = await fetch(
  //   `${SCHEMA_REGISTRY_BASE_URL}/vtex/faststore`,
  // );

  if (localSchemaPath) {
    try {
      const fileContent = readFileSync(localSchemaPath, 'utf8')
      const fastStoreSchema = parseJSONC(fileContent)

      console.log('Using a local schema as the base schema.')

      return fastStoreSchema
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.info(
          `${chalk.red('error')} - ${localSchemaPath} is a malformed JSON file.`
        )
      }
      throw err
    }
  }

  const fastStoreSchema: any = {
    $id: 'https://api.myvtex.com/api/content-platform/schemas/faststore-base',
    $schema: 'https://api.myvtex.com/api/content-platform/schemas/consumer',
    ...MockSchema,
  }

  return fastStoreSchema
}

async function groupCustomComponentDefinitions(componentsPath: string) {
  const componentsDir = await listFilesRecursive(
    componentsPath,
    CP_COMPONENT_SCHEMA_REGEX
  )

  const customComponentDefinitions: Record<string, any> = {}

  for (const schemaFileName of componentsDir) {
    const fileContent = readFileSync(schemaFileName, 'utf8')

    try {
      const componentSchema = JSON.parse(fileContent)

      // Using `$componentKey` as the property name for each component in the
      // final schema.
      customComponentDefinitions[componentSchema.$componentKey] =
        componentSchema
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.info(
          `${chalk.red(
            'error'
          )} - ${schemaFileName} is a malformed JSON file, ignoring its contents.`
        )
      } else {
        throw err
      }
    }
  }

  return customComponentDefinitions
}

async function groupCustomContentTypeDefinitions(contentTypesPath: string) {
  const contentTypesDir = await listFilesRecursive(
    contentTypesPath,
    CP_CONTENT_TYPE_SCHEMA_REGEX
  )

  const customContentTypeDefinitions = {}

  for (const contentSchemaFileName of contentTypesDir) {
    const fileContent = readFileSync(contentSchemaFileName, 'utf8')

    try {
      const contentTypeSchema = JSON.parse(fileContent)

      Object.assign(customContentTypeDefinitions, contentTypeSchema)
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.info(
          `${chalk.red(
            'error'
          )} - ${contentSchemaFileName} is a malformed JSON file, ignoring its contents.`
        )
      } else {
        throw err
      }
    }
  }

  return customContentTypeDefinitions
}

// This function adds a new property `$ALLOW_ALL_COMPONENTS` to the schema,
// under the $defs property.
function addAllowAllComponentsDefToSchema(schema: Record<string, any>) {
  const allComponentRefs = Object.keys(schema.components).map(
    (componentKey) => ({
      $ref: `#/components/${componentKey}`,
    })
  )

  const allowAllComponentsDef = {
    $ALLOW_ALL_COMPONENTS: {
      type: 'array',
      items: {
        anyOf: allComponentRefs,
      },
    },
  }

  return {
    ...schema,
    $defs: {
      ...(schema.$defs ?? {}),
      ...allowAllComponentsDef,
    },
  }
}

function findOverrides(
  defaultDefinitions: Record<string, any>,
  customDefinitions: Record<string, any>
) {
  const defaultKeys = new Set(Object.keys(defaultDefinitions))

  const duplicates = Object.keys(customDefinitions).filter((key) =>
    defaultKeys.has(key)
  )

  return duplicates
}

async function confirmUserChoice(
  duplicates: string[],
  definitionType: 'content-types' | 'components'
) {
  const goAhead = await CliUx.ux.confirm(
    `You are about to override default definitions for the following ${definitionType}:
    \n\n${chalk.yellow(duplicates.join('\n'))}
    \n\nAre you sure? [yes/no]`
  )

  if (!goAhead) {
    throw new Error('Sync operation cancelled by user.')
  }

  return
}

export async function generateFullSchema(
  componentsPath: string,
  contentTypesPath: string,
  localSchemaPath: string | null
) {
  const [customComponents, customContentTypes, originalSchema] =
    await Promise.all([
      groupCustomComponentDefinitions(componentsPath),
      groupCustomContentTypeDefinitions(contentTypesPath),
      fetchFastStoreSchema(localSchemaPath),
    ])

  const contentTypeDuplicates = findOverrides(
    originalSchema['content-types'],
    customContentTypes
  )

  const componentDuplicates = findOverrides(
    originalSchema.components,
    customComponents
  )

  if (componentDuplicates.length > 0) {
    await confirmUserChoice(componentDuplicates, 'components')
  }

  if (contentTypeDuplicates.length > 0) {
    await confirmUserChoice(contentTypeDuplicates, 'content-types')
  }

  return addAllowAllComponentsDefToSchema({
    ...originalSchema,
    components: {
      ...originalSchema.components,
      ...customComponents,
    },
    ['content-types']: {
      ...originalSchema['content-types'],
      ...customContentTypes,
    },
  })
}

export async function sendToRegistry() {}
