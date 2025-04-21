// import { fetch } from "undici";
import path, { resolve } from 'path'
import { readFileSync, readdirSync, readdir } from 'fs-extra'
import chalk from 'chalk'

import { sections as MockSchema } from './__mockSchema__'

//const SCHEMA_REGISTRY_BASE_URL =
//  "https://api.vtexcommercebeta.com.br/api/content-platform/schemas";

// const SCHEMA_REGISTRY_BASE_URL = "http://localhost:3002";

const readDirectory = async (path: string) => {
  const filesInPath = await readdir(path, { withFileTypes: true })

  const files: (string | string[])[] = await Promise.all(
    filesInPath.map((fileInPath) => {
      const resolvedPath = resolve(path, fileInPath.name)
      return fileInPath.isDirectory()
        ? readDirectory(resolvedPath)
        : resolvedPath
    })
  )

  const cpSchemaRegex = /(?:^|\/)cp_schema[^/]*\.(json|jsonc)$/

  return files.flat()?.filter((path) => cpSchemaRegex.test(path))
}

async function fetchFastStoreSchema() {
  // const fastStoreSchema = await fetch(
  //   `${SCHEMA_REGISTRY_BASE_URL}/vtex/faststore`,
  // );
  const fastStoreSchema: any = {
    // The URL here should match the actual URL from Schema Registry
    $id: 'https://api.myvtex.com/api/content-platform/schemas/faststore-base',
    // This should match the URL for our consumer meta schema.
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
      pdp: {
        title: 'Product Page',
        $extends: ['#/components/base-page-template'],
        properties: {
          seo: {
            $ref: '#/components/core.seo',
          },
        },
      },
      plp: {
        title: 'Product List Page',
        $extends: ['#/components/base-page-template'],
        properties: {
          productGalery: {
            $ref: '#/components/core.productGallery',
          },
        },
      },
      landingPage: {
        title: 'Landing Page',
        $extends: ['#/components/base-page-template'],
        properties: {
          seo: {
            $ref: '#/components/core.seo',
          },
        },
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
      '404': {
        title: 'Error 404',
        $singleton: true,
      },
    },
  }
  return fastStoreSchema
}

// This function will loop through all user `.json(c)` files and group all
// component definitions under a single object with a single `components`
// property.
export async function groupComponentDefinitions(
  basePath: string,
  componentsPath: string
) {
  const allComponentsPath = path.join(basePath, componentsPath)
  const componentsDir = await readDirectory(allComponentsPath)

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

// Same as above, but looking for content-type definitions. Might support
// multiple files or not.
export function groupContentTypeDefinitions(
  basePath: string,
  contentTypesPath: string
) {
  const allContentTypesPath = path.join(basePath, contentTypesPath)
  const componentsDir = readdirSync(allContentTypesPath)

  const customContentTypeDefinitions = {}

  console.log(componentsDir)

  for (const schemaFileName of componentsDir) {
    const fileContent = readFileSync(
      path.join(allContentTypesPath, schemaFileName),
      'utf8'
    )

    try {
      const contentTypeSchema = JSON.parse(fileContent)

      Object.assign(customContentTypeDefinitions, contentTypeSchema)
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

  return customContentTypeDefinitions
}

// This function should loop over all content-type definitions and add `anyOf`
// properties where they're missing.
// function addContentTypeScopes() {}

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
  basePath: string,
  componentsPath: string,
  // contentTypesPath: string,
  _: string
) {
  const customComponents = await groupComponentDefinitions(
    basePath,
    componentsPath
  )

  // const customContentTypes = groupContentTypeDefinitions(
  //   basePath,
  //   contentTypesPath,
  // );

  const originalSchema = await fetchFastStoreSchema()
  // ).json()) as Record<string, any>;

  return {
    ...originalSchema,
    components: {
      ...originalSchema.components,
      ...customComponents,
    },
    contentTypes: {
      ...originalSchema.contentTypes,
      // ...customContentTypes,
    },
  }
}

export async function sendToRegistry() {}
