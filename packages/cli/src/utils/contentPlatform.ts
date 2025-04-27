import chalk from 'chalk'
import { resolve } from 'path'
import { CliUx } from '@oclif/core'
import { parse as parseJSONC } from 'jsonc-parser'
import { readFileSync, readdir, stat } from 'fs-extra'

const CP_COMPONENT_SCHEMA_REGEX = /(?:^|\/)cp_schema[^/]*\.(json|jsonc)$/
const CP_CONTENT_TYPE_SCHEMA_REGEX =
  /(?:^|\/)cp_content_schema[^/]*\.(json|jsonc)$/

// This implementation is necessary to support Node 18.x, as it doesn't have
// support for `recursive: true` in `fs.readdir`.
export async function listFilesRecursive(
  basePath: string,
  matchPattern: RegExp
) {
  const isBasePathAFile = (await stat(basePath)).isFile()

  if (isBasePathAFile) {
    const fileMatchesPattern = matchPattern.test(basePath)

    return fileMatchesPattern ? [basePath] : []
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

export async function fetchFastStoreSchema(
  localSchemaPath: string | null,
  remoteSchemaUrl: string
) {
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

  try {
    const res = await fetch(remoteSchemaUrl)

    return await res.json()
  } catch (err) {
    throw new Error(
      `Failed to fetch remote base schema from ${remoteSchemaUrl}.`
    )
  }
}

export function groupCustomComponentDefinitions(componentsDir: string[]) {
  const customComponentDefinitions: Record<string, any> = {}
  const customComponentKeys = new Set<string>()

  for (const schemaFileName of componentsDir) {
    const fileContent = readFileSync(schemaFileName, 'utf8')

    try {
      const componentSchema = JSON.parse(fileContent)

      const componentKey = componentSchema.$componentKey

      if (!componentKey) {
        console.info(
          `${chalk.red(
            'error'
          )} - ${schemaFileName} is missing the $componentKey property. Ignoring it.`
        )

        continue
      }

      if (customComponentKeys.has(componentKey)) {
        console.info(
          `${chalk.red(
            'info'
          )} - The component key ${componentKey} is being used more than once.\nThis can lead to unexpected behavior, please check your component schemas.\nUsing the last definition found for this key, from: ${schemaFileName}`
        )
      } else {
        customComponentKeys.add(componentKey)
      }

      // Using `$componentKey` as the property name for each component in the
      // final schema.
      customComponentDefinitions[componentKey] = componentSchema
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.info(
          `${chalk.red(
            'error'
          )} - ${schemaFileName} is a malformed JSON file, ignoring its content.`
        )
      } else {
        throw err
      }
    }
  }

  return customComponentDefinitions
}

export function groupCustomContentTypeDefinitions(contentTypesDir: string[]) {
  const customContentTypeDefinitions = {}
  const customContentTypeKeys = new Set<string>()

  for (const contentSchemaFileName of contentTypesDir) {
    const fileContent = readFileSync(contentSchemaFileName, 'utf8')

    try {
      const contentTypeSchema = JSON.parse(fileContent)
      const keys = Object.keys(contentTypeSchema)

      for (const key of keys) {
        if (customContentTypeKeys.has(key)) {
          console.info(
            `${chalk.red(
              'info'
            )} - The content-type ${key} is being defined more than once.\nThis can lead to unexpected behavior, please check your content-type schemas.\nUsing the last definition found, from: ${contentSchemaFileName}`
          )
        } else {
          customContentTypeKeys.add(key)
        }
      }

      Object.assign(customContentTypeDefinitions, contentTypeSchema)
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.info(
          `${chalk.red(
            'error'
          )} - ${contentSchemaFileName} is a malformed JSON file, ignoring its content.`
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
export function addAllowAllComponentsDefToSchema(schema: Record<string, any>) {
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

interface GenerateFullSchemaArgs {
  componentsPath: string
  contentTypesPath: string
  remoteSchemaUrl: string
  localSchemaPath: string | null
}

export async function generateFullSchema({
  componentsPath,
  contentTypesPath,
  localSchemaPath,
  remoteSchemaUrl,
}: GenerateFullSchemaArgs) {
  const componentFiles = await listFilesRecursive(
    componentsPath,
    CP_COMPONENT_SCHEMA_REGEX
  )

  const contentTypeFiles = await listFilesRecursive(
    contentTypesPath,
    CP_CONTENT_TYPE_SCHEMA_REGEX
  )

  const originalSchema = await fetchFastStoreSchema(
    localSchemaPath,
    remoteSchemaUrl
  )
  const customComponents = groupCustomComponentDefinitions(componentFiles)
  const customContentTypes = groupCustomContentTypeDefinitions(contentTypeFiles)

  const contentTypeDuplicates = findOverrides(
    originalSchema['content-types'] ?? {},
    customContentTypes
  )

  const componentDuplicates = findOverrides(
    originalSchema.components ?? {},
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
      ...(originalSchema.components ?? {}),
      ...customComponents,
    },
    ['content-types']: {
      ...(originalSchema['content-types'] ?? {}),
      ...customContentTypes,
    },
  })
}

export async function sendToRegistry() {}
