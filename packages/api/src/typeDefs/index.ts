import { print } from 'graphql'

import { loadFilesSync } from '@graphql-tools/load-files'

export const typeDefs = loadFilesSync(__dirname, { extensions: ['.graphql'] })
  .map(print)
  .join('\n')
