// import { fetch } from "undici";
import { resolve } from 'path'
import { readFileSync, readdir, stat } from 'fs-extra'
import chalk from 'chalk'

import { formSchema as MockSchema } from './__mockSchema__'

//const SCHEMA_REGISTRY_BASE_URL =
//  "https://api.vtexcommercebeta.com.br/api/content-platform/schemas";

// const SCHEMA_REGISTRY_BASE_URL = "http://localhost:3002";

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

async function fetchFastStoreSchema() {
  // const fastStoreSchema = await fetch(
  //   `${SCHEMA_REGISTRY_BASE_URL}/vtex/faststore`,
  // );
  const fastStoreSchema: any = {
    $id: 'https://api.myvtex.com/api/content-platform/schemas/faststore-base',
    $schema: 'https://api.myvtex.com/api/content-platform/schemas/consumer',
    ...MockSchema,
  }

  return fastStoreSchema
}

async function groupComponentDefinitions(componentsPath: string) {
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

async function groupContentTypeDefinitions(contentTypesPath: string) {
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

// A more generic solution for this would be to add a `anyOf` with the same
// list of components to each individual content-type schema, but that's not
// necessary in this case, as this is only used by FastStore.
function addAnyOfToDynamicAreas(schema: Record<string, any>) {
  const allComponentRefs = Object.keys(schema.components).map(
    (componentKey) => ({
      $ref: `#/components/${componentKey}`,
    })
  )

  const baseDynamicAreaDefinition = schema.components['base-dynamic-area']

  if (!baseDynamicAreaDefinition) {
    console.info(
      `${chalk.red(
        'error'
      )} - Could not find a \`base-dynamic-area\` component definition.`
    )

    return schema.components
  }

  const updatedBaseDynamicAreaDefinition = {
    ...baseDynamicAreaDefinition,
    properties: {
      ...baseDynamicAreaDefinition.properties,
      sections: {
        type: 'array',
        items: {
          anyOf: allComponentRefs,
        },
      },
    },
  }

  return {
    ...schema,
    components: {
      ...schema.components,
      'base-dynamic-area': updatedBaseDynamicAreaDefinition,
    },
  }
}

// My idea for finding overrides is using a Set to keep track of previously
// seen $componentKey's.
// I first add every key from FastStore's schema then iterate over the custom
// components doing the same, and just keeping track of the matches.
// Finally, I can show the user the components they're about to override.
// function findOverrides(
//   defaultDefinitions: Record<string, any>,
//   customDefinitions: Record<string, any>,
// ) {}

export async function generateFullSchema(
  componentsPath: string,
  contentTypesPath: string
) {
  const [customComponents, customContentTypes, originalSchema] =
    await Promise.all([
      groupComponentDefinitions(componentsPath),
      groupContentTypeDefinitions(contentTypesPath),
      fetchFastStoreSchema(),
    ])

  return addAnyOfToDynamicAreas({
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
