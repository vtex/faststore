import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import type { GraphQLSchema } from 'graphql'

import { validateUserAuthentication } from '../platforms/vtex/utils/auth'
import type { Directive } from './index'

const NAME = 'auth'

const directive: Directive = {
  typeDefs: `directive @auth on FIELD_DEFINITION`,
  transformer: (schema: GraphQLSchema) => {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const authDirective = getDirective(schema, fieldConfig, NAME)?.[0]

        if (authDirective) {
          const originalResolver = fieldConfig.resolve

          fieldConfig.resolve = async (root, args, context, info) => {
            // Validate user authentication before proceeding with the resolver
            await validateUserAuthentication(context)

            // Continue with the original resolver
            return originalResolver?.(root, args, context, info)
          }
        }

        return fieldConfig
      },
    })
  },
}

export default directive
