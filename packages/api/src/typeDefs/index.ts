import { print } from 'graphql'

import { loadFilesSync } from '@graphql-tools/load-files'

// Empty string ('') is interpreted as the current dir. Referencing it as './' won't work.
export const typeDefs = loadFilesSync(__dirname, { extensions: ['.graphql'] })
  .map(print)
  .join('\n')
