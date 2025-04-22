// import { fetch } from "undici";
import { resolve } from 'path'
import { readFileSync, readdir } from 'fs-extra'
import chalk from 'chalk'

import { sections as MockSchema } from './__mockSchema__'

//const SCHEMA_REGISTRY_BASE_URL =
//  "https://api.vtexcommercebeta.com.br/api/content-platform/schemas";

// const SCHEMA_REGISTRY_BASE_URL = "http://localhost:3002";

const CP_COMPONENT_SCHEMA_REGEX = /(?:^|\/)cp_schema[^/]*\.(json|jsonc)$/
const CP_CONTENT_TYPE_SCHEMA_REGEX =
  /(?:^|\/)cp_content_schema[^/]*\.(json|jsonc)$/

// This implementation is necessary to support Node 18.x, as it doesn't have
// support for `recursive: true` in `fs.readdir`.
async function listFilesRecursive(basePath: string, matchPattern: RegExp) {
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
    title: 'FastStore Base Schemas',
    description: 'Collection of base schemas for FastStore',
    contexts: {},
    components: [...MockSchema],
    contentTypes: {
      globalSections: {
        title: 'Global Sections',
        $singleton: true,
        $extends: ['#/components/base-page-template'],
      },
      globalHeaderSections: {
        title: 'Global Header Sections',
        $singleton: true,
        $extends: ['#/components/base-page-template'],
      },
      globalFooterSections: {
        title: 'Global Footer Sections',
        $singleton: true,
        $extends: ['#/components/base-page-template'],
      },
      home: {
        title: 'Home',
        $singleton: true,
        $extends: ['#/components/base-page-template'],
        properties: {
          seo: {
            $ref: '#/components/core.seo',
          },
          sections: {
            items: {
              // Allowed sections provided by scopes
              anyOf: [
                {
                  $ref: '#/$defs/components/core.richText',
                },
                {
                  $ref: '#/$defs/components/core.hero',
                },
                {
                  $ref: '#/$defs/components/core.productShelf',
                },
              ],
            },
          },
        },
      },
      search: {
        title: 'Search Page',
        $singleton: true,
        $extends: ['#/components/base-page-template'],
        properties: {
          productGalery: {
            $ref: '#/components/core.productGallery',
          },
        },
      },
      login: {
        title: 'Login',
        $singleton: true,
      },
      '500': {
        title: 'Error 500',
        $singleton: true,
      },
    },
  }

  return fastStoreSchema
}

// This function will loop through all user `.json(c)` files and group all
// component definitions under a single object with a single `components`
// property.
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

  console.log('contentTypesDir', contentTypesDir)

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

// This function should loop over all content-type definitions and add `anyOf`
// properties where they're missing.
// function addContentTypeScopes(
//   components: Record<string, any>,
//   contentTypes: Record<string, any>,
// ) {
//   const baseAllComponentsDefinition = {

//   }
// }

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

  return {
    ...originalSchema,
    components: {
      ...originalSchema.components,
      ...customComponents,
    },
    contentTypes: {
      ...originalSchema.contentTypes,
      ...customContentTypes,
    },
  }
}

export async function sendToRegistry() {}
