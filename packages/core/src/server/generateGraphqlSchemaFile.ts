import { GraphQLSchema } from 'graphql'
import { writeFileSync } from 'fs-extra'
import { printSchemaWithDirectives } from '@graphql-tools/utils'

import { apiSchema } from './schema'

async function createGraphqlSchemaFile(apiSchema: Promise<GraphQLSchema>) {
  try {
    writeFileSync(
      [process.cwd(), '@generated', 'graphql', 'schema.graphql'].join('/'),
      printSchemaWithDirectives(await apiSchema)
    )

    console.log('Schema GraphQL file generated successfully')
  } catch (e) {
    console.error('An error occurred while generating the GraphQL schema file')

    throw e
  }
}

createGraphqlSchemaFile(apiSchema)
