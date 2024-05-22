import { type CodegenConfig } from '@graphql-codegen/cli'
import { Kind, type DocumentNode } from 'graphql'

/* Extracts operationName from queries. Example: ServerProductQuery */
const getOperationName = (document: DocumentNode) => {
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

const config: CodegenConfig = {
  overwrite: true,
  errorsOnly: false,
  debug: true,
  verbose: true,
  schema: './@generated/schema.graphql',
  documents: ['./src/**/*.{ts,tsx}'],
  generates: {
    './@generated/': {
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

export default config
